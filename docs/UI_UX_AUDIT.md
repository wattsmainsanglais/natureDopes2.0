# UI/UX Audit Report: Nature Dopes 2.0
**Production Readiness Assessment**
**Date:** November 29, 2025
**Status:** Pre-Production - **4/8 Critical Issues Complete (50%)**
**Last Updated:** November 30, 2025

---

## Executive Summary

This audit identified **47 actionable issues** across user experience, accessibility, visual design, and code quality. The application has a solid foundation with good use of Radix UI components and internationalization, but requires attention in several critical areas before production deployment.

**Issue Breakdown:**
- 🔴 **Critical Issues:** 8 total - ✅ **4 COMPLETED**, ⏳ 4 remaining
- 🟠 **High Priority:** 15 (Significantly impact UX)
- 🟡 **Medium Priority:** 16 (Polish and improvements)
- 🔵 **Low Priority:** 8 (Nice-to-haves)

---

## Progress Tracker

### ✅ Completed Issues
- [x] **Issue #1:** Console.log removal - ALL client-side console.logs removed
- [x] **Issue #3:** Environment variable exposure - Fixed map API fetch bug
- [x] **Issue #4:** Loading states - Map refresh now has loading/success indicators
- [x] **Issue #6:** Error boundaries - Added to map, gallery, finder, and global

### ⏳ In Progress
- [ ] **Issue #2:** ARIA labels (Next priority - 6 hours)
- [ ] **Issue #5:** Form validation (4 hours)
- [ ] **Issue #7:** Password toggle (2 hours)
- [ ] **Issue #8:** Confirmation dialogs (1 hour)

### ✅ High Priority Completed
- [x] **Issue #11:** Map interaction usability - Completed November 30, 2025

---

## Table of Contents

1. [Critical Issues](#critical-issues)
2. [High Priority Issues](#high-priority-issues)
3. [Medium Priority Issues](#medium-priority-issues)
4. [Low Priority Issues](#low-priority-issues)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Testing Checklist](#testing-checklist)

---

## Critical Issues

### 1. Console.log Statements in Production Code ✅ COMPLETED

**Priority:** CRITICAL
**Status:** ✅ **COMPLETED** - November 29, 2025
**Impact:** Security risk, performance overhead, unprofessional appearance

**Files Affected:**
- All client-side console.log statements removed
- Server-side console.error statements retained (appropriate for logging)

**Solution Applied:**
All client-side console.log statements have been removed from the codebase. Server-side console.error statements were intentionally kept for error logging.

**Time Taken:** 30 minutes

---

### 2. Zero ARIA Labels and Accessibility Attributes 🔴

**Priority:** CRITICAL
**Impact:** Violates WCAG 2.1 AA standards, makes app inaccessible to screen readers

**Components Affected:**
- Navigation hamburger menu (no label)
- Theme switcher (no current theme indication)
- Language switcher (no label)
- Map markers (no accessible names)
- Form submit buttons (no loading state announcements)
- Image upload forms (no field descriptions)
- Gallery switches (no state indication)

**Solutions:**

```tsx
// Navigation
<Button aria-label="Open navigation menu">
  <RxHamburgerMenu size={30} />
</Button>

// Map toggle
<Switch
  aria-label="Toggle between all finds and your finds"
  aria-checked={!allChecked}
/>

// Form fields
<TextField.Root
  aria-describedby="species-helper"
  aria-required="true"
  aria-invalid={!!error}
/>
<Text id="species-helper" size="1" color="gray">
  Enter the common or scientific name
</Text>
```

**Estimated Time:** 4-6 hours

---

### 3. Client-Side Environment Variable Exposure ✅ COMPLETED

**Priority:** CRITICAL
**Status:** ✅ **COMPLETED** - November 29, 2025
**Impact:** Variables undefined in production, API key quotas can be exhausted

**File:** `src/app/[locale]/map/_components/GMap.tsx`

**Issues:**
- Line 52: `process.env.LIVESITE` was `undefined` in client component
- Caused 404 errors when refreshing map data after upload/edit

**Solution Applied:**
Used relative path construction instead of environment variable:
```tsx
// Before (broken):
const res = await fetch(`${process.env.LIVESITE}/map/api`) // undefined/map/api

// After (working):
const apiPath = `${window.location.pathname}/api` // /en/map/api
const res = await fetch(apiPath, { cache: 'no-store' })
```

**Additional Improvements:**
- Added array validation before setting state
- Added defensive `Array.isArray()` check in render
- Proper error handling with try/catch

**Note:** Google Maps API key still needs restrictions in Google Cloud Console (TODO for later)

**Time Taken:** 1 hour

---

### 4. Missing Loading States on Critical Operations ✅ COMPLETED

**Priority:** CRITICAL
**Status:** ✅ **COMPLETED** - November 29, 2025
**Impact:** Users don't know if app is frozen or working

**Files Affected:**
- `src/app/[locale]/map/_components/GMap.tsx` - getData function now has full loading states

**Solution Applied:**

Added comprehensive loading states with visual feedback:

```tsx
// Added state variables
const [isRefreshing, setIsRefreshing] = useState(false)
const [refreshSuccess, setRefreshSuccess] = useState(false)

// Updated getData function with loading states
async function getData() {
  setIsRefreshing(true)
  setRefreshSuccess(false)

  try {
    const apiPath = `${window.location.pathname}/api`
    const res = await fetch(apiPath, { cache: 'no-store' })

    if (!res.ok) throw new Error('Failed to fetch map data')

    const newData = await res.json()
    if (!Array.isArray(newData)) throw new Error('Invalid data format')

    setImageData(newData)

    // Show success message for 3 seconds
    setRefreshSuccess(true)
    setTimeout(() => setRefreshSuccess(false), 3000)

    return { success: 'Map updated' }
  } catch (error) {
    console.error('Error fetching map data:', error)
    return { error: 'Failed to update map. Please try again.' }
  } finally {
    setIsRefreshing(false)
  }
}
```

**UI Improvements:**
- Blue callout with spinner: "Updating map..." (during fetch)
- Green callout with checkmark: "Map updated successfully!" (auto-dismisses after 3s)
- "Add" button disabled during refresh to prevent double-clicks

**MapMarker Image Loading:**
- Already has loading gif implementation
- TODO: Add error state for failed image loads (Priority 2)

**Time Taken:** 2 hours

---

### 5. No Form Validation on Required Fields 🔴

**Priority:** CRITICAL
**Impact:** Poor UX, unnecessary server load, doesn't guide users

**Files Affected:**
- `src/app/[locale]/register/page.tsx`
- `src/app/[locale]/signin/page.tsx`
- `src/app/[locale]/map/_components/forms/ImageUploadForm.tsx`
- All password reset forms

**Solution:**

```tsx
// Registration form example
<TextField.Root
  size='3'
  placeholder="Username"
  name='Username'
  required
  minLength={3}
  maxLength={20}
  pattern="[A-Za-z0-9]+"
  aria-describedby="username-requirements"
/>
<Text id="username-requirements" size="1" color="gray">
  3-20 characters, letters and numbers only
</Text>

// Email validation
<TextField.Root
  type="email"
  required
  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
  aria-describedby="email-requirements"
/>

// Password validation
<TextField.Root
  type="password"
  required
  minLength={8}
  aria-describedby="password-requirements"
/>
<Text id="password-requirements" size="1" color="gray">
  Minimum 8 characters
</Text>
```

**Estimated Time:** 3-4 hours

---

### 6. Missing Error Boundaries ✅ COMPLETED

**Priority:** CRITICAL
**Status:** ✅ **COMPLETED** - November 29, 2025
**Impact:** Unhandled errors crash entire page instead of showing graceful error UI

**Solution Applied:**

Created comprehensive error boundaries with Nature Dopes branding:

**Files Created:**
- ✅ `src/app/[locale]/map/error.tsx` - Map-specific errors
- ✅ `src/app/[locale]/gallery/error.tsx` - Gallery-specific errors
- ✅ `src/app/[locale]/finder/error.tsx` - Finder game errors
- ✅ `src/app/[locale]/error.tsx` - Global fallback for all other routes

**Features Implemented:**
- Nature Dopes logo on error screens
- Context-specific error messages per route
- "Try again" button (attempts recovery)
- "Home" button (safe escape route)
- Structured error logging with timestamp, message, digest, stack
- Development-only error details display
- Mobile-responsive layout
- TODO comments for future error tracking service integration (Sentry, LogRocket)

**Error Hierarchy:**
- Map crashes → Map error boundary
- Gallery crashes → Gallery error boundary
- Finder crashes → Finder error boundary
- Other routes → Global error boundary

**Time Taken:** 1.5 hours

---

### 7. Password Fields Missing Show/Hide Toggle 🔴

**Priority:** CRITICAL
**Impact:** Accessibility issue, harder to detect typos

**Files Affected:** All password input fields

**Solution:**

```tsx
'use client'
import { useState } from 'react'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { TextField, IconButton } from '@radix-ui/themes'

export function PasswordField({ name, placeholder, ...props }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField.Root
      type={showPassword ? 'text' : 'password'}
      name={name}
      placeholder={placeholder}
      {...props}
    >
      <TextField.Slot side="right">
        <IconButton
          size="1"
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  )
}
```

**Estimated Time:** 2 hours

---

### 8. Missing Confirmation for Destructive Actions 🔴

**Priority:** CRITICAL
**Impact:** Users can accidentally delete API keys with no recovery

**File:** `src/app/[locale]/api-keys/_components/ApiKeyManager.tsx` (line 103)

**Solution:**

```tsx
import { AlertDialog } from '@radix-ui/themes'

const [revokeConfirmId, setRevokeConfirmId] = useState<number | null>(null)

// In render:
<AlertDialog.Root open={revokeConfirmId === key.id} onOpenChange={(open) => !open && setRevokeConfirmId(null)}>
  <AlertDialog.Trigger>
    <Button
      color="red"
      variant="soft"
      onClick={() => setRevokeConfirmId(key.id)}
    >
      Revoke
    </Button>
  </AlertDialog.Trigger>

  <AlertDialog.Content>
    <AlertDialog.Title>Revoke API Key?</AlertDialog.Title>
    <AlertDialog.Description>
      This will permanently revoke "{key.name}". Applications using this key will immediately stop working.
      This action cannot be undone.
    </AlertDialog.Description>

    <Flex gap="3" justify="end" mt="4">
      <AlertDialog.Cancel>
        <Button variant="soft" color="gray">Cancel</Button>
      </AlertDialog.Cancel>
      <AlertDialog.Action>
        <Button
          color="red"
          onClick={() => {
            revokeApiKey(key.id)
            setRevokeConfirmId(null)
          }}
        >
          Revoke Key
        </Button>
      </AlertDialog.Action>
    </Flex>
  </AlertDialog.Content>
</AlertDialog.Root>
```

**Estimated Time:** 1 hour

---

## High Priority Issues

### 9. Inconsistent Error Message Display 🟠

**Files:** Multiple form components
**Issue:** Error messages lack consistent styling

**Solution:** Create reusable ErrorMessage component

```tsx
// src/app/[locale]/_components/ErrorMessage.tsx
import { Callout } from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

export function ErrorMessage({ children }: { children: React.ReactNode }) {
  if (!children) return null

  return (
    <Callout.Root color="red" size="1" mt="2">
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text>{children}</Callout.Text>
    </Callout.Root>
  )
}

// Usage:
<ErrorMessage>{errors}</ErrorMessage>
```

**Estimated Time:** 1 hour

---

### 10. Missing Success Message Auto-Dismiss 🟠

**Files:** All forms with success states
**Issue:** Success messages persist indefinitely

**Solution:**

```tsx
useEffect(() => {
  if (success) {
    const timer = setTimeout(() => setSuccess(''), 5000)
    return () => clearTimeout(timer)
  }
}, [success])
```

**Estimated Time:** 30 minutes

---

### 11. Map Interaction Usability Issues ✅ COMPLETED

**Priority:** HIGH
**Status:** ✅ **COMPLETED** - November 30, 2025
**File:** `src/app/[locale]/map/_components/GMap.tsx`

**Issues Addressed:**
1. ✅ onClick logs coordinates but no visual feedback
2. ✅ No way to clear selection
3. ✅ Upload button enabled with incomplete data

**Solution Implemented:**

**Temporary Visual Marker (GMap.tsx:228-242):**
```tsx
{clickedPosition && (
  <DotFilledIcon
    lat={clickedPosition.lat}
    lng={clickedPosition.lng}
    width={32}
    height={32}
    color="#3b82f6"
    style={{
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      marginLeft: '-16px',
      marginTop: '-16px'
    }}
  />
)}
```

**Form Validation (ImageUploadForm.tsx:121):**
```tsx
<SubmitButton disabled={!speciesName.trim() || lng === undefined || lat === undefined}>
  {t('uploadbutton')}
</SubmitButton>
```

**Clear Location Button (ImageUploadForm.tsx:108-121):**
```tsx
{(lng !== undefined && lat !== undefined) && (
  <Flex mb='2'>
    <Button
      type="button"
      size='2'
      variant='soft'
      color='gray'
      onClick={clearSelection}
    >
      <CrossCircledIcon /> {t('clearLocation')}
    </Button>
  </Flex>
)}
```

**Features Implemented:**
- Blue dot marker appears when user clicks map
- Upload button disabled until species name AND coordinates are set
- "Clear Location" button removes marker and disables upload button
- Clean mobile-friendly UX - no cluttered coordinate displays
- Translations added to both en.json and fr.json

**User Flow:**
1. Open upload form → Upload button disabled
2. Click map → Blue marker appears, coordinates populate
3. Enter species name → Upload button becomes enabled
4. Click "Clear Location" → Marker disappears, button disabled again
5. Click new location → Ready to upload

**Time Taken:** 1.5 hours

---

### 12. Gallery Toggle Confusion 🟠

**File:** `src/app/[locale]/gallery/_components/MainGalleryComponent.tsx` (line 39)

**Issue:** Switch is ambiguous, users don't know current state

**Solution:**

```tsx
// Replace Switch with SegmentedControl
import { SegmentedControl } from '@radix-ui/themes'

<SegmentedControl.Root
  value={galleryInView ? 'nd' : 'user'}
  onValueChange={(val) => setGalleryInView(val === 'nd')}
>
  <SegmentedControl.Item value="nd">
    ND Gallery
  </SegmentedControl.Item>
  <SegmentedControl.Item value="user">
    Your Gallery
  </SegmentedControl.Item>
</SegmentedControl.Root>
```

**Estimated Time:** 30 minutes

---

### 13. MapMarker Interaction Issues 🟠

**File:** `src/app/[locale]/map/_components/MapMarker.tsx`

**Issues:**
1. Close button too small (size='1')
2. Flower colors insufficient contrast
3. No keyboard navigation
4. Edit button invisible on touch devices

**Solutions:**

```tsx
// Increase close button size
<Button size='2' onClick={toggleIs}>✕</Button>

// Better color distinction
{session == user_id.toString() ?
  <Badge color="green"><RiFlowerFill size={15} /></Badge> :
  <RiFlowerFill size={15} color="green"/>
}

// Add keyboard support
<Box
  onMouseEnter={changePointer}
  onMouseLeave={leavePointer}
  onTouchStart={changePointer}
  onClick={() => getImageApi(ipath)}
  onKeyDown={(e) => e.key === 'Enter' && getImageApi(ipath)}
  tabIndex={0}
  role="button"
  aria-label={`View ${text} image`}
>

// Show edit button on touch for own markers
{session == user_id.toString() && (
  <Button
    className={style.editButton}
    onClick={() => toggleEditForm(text, id, lng, lat)}
    size='2'
  >
    {t('editbutton')}
  </Button>
)}
```

**Estimated Time:** 2 hours

---

### 14. Missing Image Upload Size Validation Feedback 🟠

**File:** `src/app/[locale]/map/_components/forms/ImageUploadForm.tsx` (lines 101-107)

**Issue:** Error appears in wrong location, file stays selected, can still submit

**Solution:**

```tsx
const [selectedFile, setSelectedFile] = useState<File | null>(null)

<input
  className={style.uploadFileButton}
  name='image_file'
  type="file"
  accept=".png, .jpg, .jpeg, .heic, .svg"
  onChange={(event) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1000 * 1024) {
        setError("Photo with maximum size of 5MB is allowed")
        event.target.value = '' // Clear input
        setSelectedFile(null)
      } else {
        setError('')
        setSelectedFile(file)
      }
    }
  }}
/>

{selectedFile && (
  <Text size="1" color="gray">
    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
  </Text>
)}

<SubmitButton disabled={!selectedFile || !!errors}>
  {t('uploadbutton')}
</SubmitButton>
```

**Estimated Time:** 1 hour

---

### 15. Navigation Menu Missing Icons 🟠

**File:** `src/app/[locale]/_components/navigation/nav.tsx`

**Solution:**

```tsx
import { MapIcon, ImageIcon, MagnifyingGlassIcon, HomeIcon } from '@radix-ui/react-icons'

<Link href="/map">
  <DropdownMenu.Item>
    <Flex gap="2" align="center">
      <MapIcon /> <Text>{t('map')}</Text>
    </Flex>
  </DropdownMenu.Item>
</Link>
```

**Estimated Time:** 30 minutes

---

### 16. No Keyboard Shortcuts 🟠

**Solution:** Implement common shortcuts

```tsx
// In layout or page component
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Escape to close modals
    if (e.key === 'Escape') {
      closeAllModals()
    }

    // / to focus search
    if (e.key === '/' && !isInputFocused()) {
      e.preventDefault()
      searchInputRef.current?.focus()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

**Estimated Time:** 2 hours

---

### 17. Sign In Error Messages Too Generic 🟠

**File:** `src/app/[locale]/signin/page.tsx` (line 44)

**Solution:**

```tsx
// In server action
try {
  // ... auth logic
} catch (error) {
  if (error instanceof NetworkError) {
    return { error: 'Unable to connect. Please check your internet connection.' }
  }
  if (error instanceof RateLimitError) {
    return { error: 'Too many attempts. Please try again in 15 minutes.' }
  }
  return { error: 'Invalid email or password.' }
}
```

**Estimated Time:** 1 hour

---

### 18. Missing "Remember Me" Option 🟠

**File:** `src/app/[locale]/signin/page.tsx`

**Solution:**

```tsx
// Add checkbox to form
<Flex align="center" gap="2">
  <Checkbox id="remember" name="remember" />
  <label htmlFor="remember">Remember me</label>
</Flex>

// In NextAuth config
callbacks: {
  jwt: async ({ token, user, account }) => {
    if (account?.rememberMe) {
      token.maxAge = 30 * 24 * 60 * 60 // 30 days
    }
    return token
  }
}
```

**Estimated Time:** 1-2 hours

---

### 19. No Loading State in Image Gallery 🟠

**File:** `src/app/[locale]/gallery/_components/MainGalleryComponent.tsx`

**Solution:**

```tsx
import { Skeleton } from '@radix-ui/themes'

{isLoading ? (
  <Grid columns="3" gap="4">
    {Array.from({ length: 9 }).map((_, i) => (
      <Skeleton key={i} height="200px" />
    ))}
  </Grid>
) : (
  <IagonGallery images={userImages} />
)}
```

**Estimated Time:** 1 hour

---

### 20. Finder Game - No Progress Indicator 🟠

**File:** `src/app/[locale]/finder/game/Game.tsx`

**Solution:**

```tsx
import { Progress } from '@radix-ui/themes'

const totalFlowers = foundPics.length + flowerPics.length
const progress = (foundPics.length / totalFlowers) * 100

<Flex direction="column" gap="2">
  <Text size="2" color="gray">
    Progress: {foundPics.length} / {totalFlowers} flowers found
  </Text>
  <Progress value={progress} max={100} />
</Flex>
```

**Estimated Time:** 30 minutes

---

### 21. API Key Manager - No Copy Confirmation Duration 🟠

**File:** `src/app/[locale]/api-keys/_components/ApiKeyManager.tsx` (line 125)

**Solution:**

```tsx
// Increase timeout from 2s to 3s
setTimeout(() => setCopiedId(null), 3000)

// Add toast notification
import { Toast } from '@radix-ui/themes'

{copiedId && (
  <Toast.Root open={!!copiedId}>
    <Toast.Title>Copied to clipboard</Toast.Title>
    <Toast.Description>API key copied successfully</Toast.Description>
  </Toast.Root>
)}
```

**Estimated Time:** 30 minutes

---

### 22. No Empty State Messages 🟠

**Solution:** Add helpful empty states

```tsx
// Example for empty gallery
function EmptyGallery() {
  return (
    <Flex
      direction="column"
      align="center"
      gap="3"
      py="9"
      style={{ minHeight: '400px' }}
      justify="center"
    >
      <ImageIcon width={48} height={48} color="gray" />
      <Heading size="6" color="gray">No images yet</Heading>
      <Text color="gray" align="center">
        Upload your first nature find to start building your gallery!
      </Text>
      <Button onClick={openUploadForm} size="3">
        Upload Image
      </Button>
    </Flex>
  )
}
```

**Files to update:**
- Empty user gallery
- No map search results
- No API keys created
- No game results

**Estimated Time:** 2 hours

---

### 23. Register Success Doesn't Redirect 🟠

**File:** `src/app/[locale]/register/page.tsx`

**Solution:**

```tsx
import { useRouter } from 'next/navigation'

const router = useRouter()
const [countdown, setCountdown] = useState<number | null>(null)

useEffect(() => {
  if (success) {
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          router.push('/signin')
          return null
        }
        return prev ? prev - 1 : null
      })
    }, 1000)
    return () => clearInterval(interval)
  }
}, [success, router])

// In UI
{success && countdown && (
  <Text size="2" color="gray">
    Redirecting to sign in in {countdown}...
  </Text>
)}
```

**Estimated Time:** 1 hour

---

## Medium Priority Issues

### 24. Inconsistent Button Sizes 🟡

**Solution:** Establish size standards in design system

- Primary actions: `size='3'`
- Secondary actions: `size='2'`
- Tertiary/icon buttons: `size='1'`

**Estimated Time:** 2 hours (review and update all buttons)

---

### 25. Missing Focus Indicators 🟡

**Solution:** Add to `globals.css`

```css
*:focus-visible {
  outline: 2px solid var(--green-9);
  outline-offset: 2px;
  border-radius: 4px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--green-9);
  outline-offset: 2px;
}
```

**Estimated Time:** 30 minutes

---

### 26. Footer Links Missing External Link Warning 🟡

**File:** `src/app/[locale]/_components/footer/Footer.tsx` (line 51)

**Solution:**

```tsx
import { ExternalLinkIcon } from '@radix-ui/react-icons'

<Link href="https://awattsdev.eu" target="_blank" rel="noopener noreferrer">
  <Flex gap="1" align="center">
    awattsdev
    <ExternalLinkIcon aria-label="(opens in new tab)" />
  </Flex>
</Link>
```

**Estimated Time:** 15 minutes

---

### 27. Map Search Submits But Does Nothing 🟡

**File:** `src/app/[locale]/map/_components/GMap.tsx` (lines 95-98)

**Solution:**

```tsx
// Remove form wrapper, just use TextField
<TextField.Root
  placeholder={t('searchbar')}
  onChange={event => setSearchParams(event.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
/>
```

**Estimated Time:** 15 minutes

---

### 28. Mobile Responsiveness - Upload Form Overlay 🟡

**File:** `src/app/[locale]/map/_components/forms/ImageUploadForm.tsx`

**Solution:**

```css
/* In uploadForm.module.css */
@media (max-width: 768px) {
  .uploadFormWrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 12px 12px 0 0;
  }
}
```

**Estimated Time:** 1 hour

---

### 29. Theme Switcher Missing Current State Indicator 🟡

**Solution:**

```tsx
// In ThemeSwitcher component
const { theme } = useTheme()

<Flex gap="2" align="center">
  <Text size="1" color="gray">{theme === 'dark' ? 'Dark' : 'Light'}</Text>
  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
</Flex>
```

**Estimated Time:** 30 minutes

---

### 30. No Image Optimization 🟡

**Solution:**

```tsx
<Image
  quality={85}
  priority={isAboveFold}
  placeholder="blur"
  {...props}
/>
```

**Estimated Time:** 1 hour

---

### 31. Hardcoded Text Instead of Translations 🟡

**Files:** Multiple

**Examples:**
- `register/page.tsx` line 33: "Create new account"
- `register/page.tsx` line 49: "Have an account already?"
- `nav.tsx` line 26: "Home" not translated

**Solution:** Move to messages files

```json
// messages/en.json
{
  "Register": {
    "heading": "Create new account",
    "hasAccount": "Have an account already?"
  }
}
```

**Estimated Time:** 2 hours

---

### 32. Password Reset Token Expiry Not Shown 🟡

**File:** `src/app/[locale]/forgotPassword/password-reset/[token]/page.tsx`

**Solution:**

```tsx
<Callout.Root color="blue" size="1">
  <Callout.Icon><InfoCircledIcon /></Callout.Icon>
  <Callout.Text>This link expires in 24 hours</Callout.Text>
</Callout.Root>
```

**Estimated Time:** 15 minutes

---

### 33. Contact Form Missing Privacy Notice 🟡

**File:** `src/app/[locale]/_components/homeContent/contact/ContactForm.tsx`

**Solution:**

```tsx
<Text size="1" color="gray" mt="2">
  By submitting, you agree to our{' '}
  <Link href="/privacy">Privacy Policy</Link>.
</Text>
```

**Estimated Time:** 30 minutes (+ create privacy policy page)

---

### 34. API Key Dialog "Important" Message Lacks Visual Emphasis 🟡

**File:** `src/app/[locale]/api-keys/_components/ApiKeyManager.tsx` (line 166)

**Solution:**

```tsx
<Callout.Root color="orange" size="2">
  <Callout.Icon>
    <ExclamationTriangleIcon />
  </Callout.Icon>
  <Callout.Text>
    <strong>Important:</strong> Copy your API key now. You won't be able to see it again.
  </Callout.Text>
</Callout.Root>
```

**Estimated Time:** 15 minutes

---

### 35. No Rate Limit Feedback 🟡

**File:** `src/app/[locale]/api-keys/_components/ApiKeyManager.tsx`

**Solution:** (if Go API supports it)

```tsx
<Flex direction="column" gap="1">
  <Text size="1">Usage: {usage.count}/100 requests this hour</Text>
  <Progress value={usage.count} max={100} />
</Flex>
```

**Estimated Time:** 2 hours (requires Go API endpoint)

---

### 36. Gallery Images Missing Alt Text 🟡

**File:** `src/app/[locale]/gallery/_components/galleries/IagonImage.tsx` (line 52)

**Solution:**

```tsx
alt={imageData.species_name || 'Nature photograph'}
```

**Estimated Time:** 15 minutes

---

### 37. Map Filter Uses Imperative Language 🟡

**File:** `src/app/[locale]/map/_components/GMap.tsx` (lines 126-128)

**Solution:**

```tsx
<SegmentedControl.Root value={allChecked ? 'all' : 'mine'}>
  <SegmentedControl.Item value="all">All Finds</SegmentedControl.Item>
  <SegmentedControl.Item value="mine">My Finds</SegmentedControl.Item>
</SegmentedControl.Root>
```

**Estimated Time:** 30 minutes

---

### 38. Edit Form Placeholder Uses Old Value 🟡

**File:** `src/app/[locale]/map/_components/forms/EditImageForm.tsx` (line 84)

**Solution:**

```tsx
<TextField.Root
  name='species'
  defaultValue={species}
  placeholder='Species name'
/>
```

**Estimated Time:** 15 minutes

---

### 39. Missing Metadata Descriptions 🟡

**File:** `src/app/[locale]/layout.tsx` (line 37)

**Solution:**

```tsx
export const metadata: Metadata = {
  title: 'Nature Dopes - Wild Flora Discovery & Documentation',
  description: 'Discover, document, and share wild flora through interactive mapping. Join our community of nature enthusiasts preserving botanical knowledge across Western Europe.',
  keywords: 'nature, flora, plants, wildflowers, botanical, identification, mapping',
  openGraph: {
    title: 'Nature Dopes - Wild Flora Discovery',
    description: 'Interactive platform for documenting and sharing wild flora',
    type: 'website',
  }
}
```

**Estimated Time:** 30 minutes

---

## Low Priority Issues

### 40. Commented Out Code 🔵

**Files:**
- `src/app/[locale]/_components/navigation/navBar.tsx` (lines 38-44, 67-70)
- `src/app/[locale]/_components/homeContent/Splash.tsx` (lines 41-58)
- `src/app/[locale]/_nft/page.tsx` (line 13)

**Solution:** Remove before production

**Estimated Time:** 30 minutes

---

### 41. Inconsistent Quote Styles 🔵

**Solution:** Configure Prettier

```json
// .prettierrc
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

Run: `npx prettier --write "src/**/*.{ts,tsx}"`

**Estimated Time:** 15 minutes

---

### 42. Missing Favicon Configuration 🔵

**Solution:**

Add `app/icon.png` (Next.js 13+ convention) or add to layout:

```tsx
export const metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  }
}
```

**Estimated Time:** 30 minutes

---

### 43. Unused Imports 🔵

**Solution:** Run ESLint auto-fix

```bash
npx eslint --fix "src/**/*.{ts,tsx}"
```

**Estimated Time:** 15 minutes

---

### 44. Color Contrast May Be Insufficient 🔵

**Solution:** Use contrast checker and adjust

- Use `--green-11` for text on light backgrounds
- Use `--green-3` for backgrounds with dark text
- Test with WebAIM Contrast Checker

**Estimated Time:** 1 hour

---

### 45. No Breadcrumb Navigation 🔵

**Solution:** Create Breadcrumb component

```tsx
// src/app/[locale]/_components/Breadcrumb.tsx
export function Breadcrumb({ items }: { items: { label: string, href?: string }[] }) {
  return (
    <Flex gap="2" align="center">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <Text color="gray">/</Text>}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <Text>{item.label}</Text>
          )}
        </Fragment>
      ))}
    </Flex>
  )
}
```

**Estimated Time:** 1 hour

---

### 46. Missing Print Styles 🔵

**Solution:** Add to globals.css

```css
@media print {
  nav, footer, button { display: none; }
  .map-container { height: auto !important; }
  * { background: white !important; color: black !important; }
}
```

**Estimated Time:** 30 minutes

---

### 47. No Analytics Event Tracking 🔵

**Solution:**

```tsx
import { track } from '@vercel/analytics'

// On image upload success
track('image_uploaded', { species: species_name })

// On game completion
track('game_completed', { score: foundPics.length })

// On API key creation
track('api_key_created', { name: keyName })
```

**Estimated Time:** 1 hour

---

## Implementation Roadmap

### Phase 1: Pre-Launch Critical (1-2 weeks)

**Week 1:**
- [ ] Remove all console.log statements (30 min)
- [ ] Add ARIA labels to all interactive elements (6 hours)
- [ ] Fix environment variable exposure (2 hours)
- [ ] Add client-side form validation (4 hours)
- [ ] Implement loading states (2 hours)

**Week 2:**
- [ ] Add error boundaries (1 hour)
- [ ] Implement password show/hide toggle (2 hours)
- [ ] Add confirmation dialogs for destructive actions (1 hour)
- [ ] Test all critical fixes (4 hours)

**Total Estimated Time:** 22.5 hours

---

### Phase 2: Launch-Ready (1 week)

- [ ] Consistent error message component (1 hour)
- [ ] Auto-dismiss success messages (30 min)
- [ ] Fix map interaction UX (2 hours)
- [ ] Improve gallery toggle (30 min)
- [ ] Fix MapMarker interactions (2 hours)
- [ ] Image upload validation feedback (1 hour)
- [ ] Add navigation icons (30 min)
- [ ] Implement keyboard shortcuts (2 hours)
- [ ] Better sign-in error messages (1 hour)
- [ ] Add "Remember Me" option (2 hours)
- [ ] Gallery loading states (1 hour)
- [ ] Finder game progress indicator (30 min)
- [ ] API key copy improvements (30 min)
- [ ] Add empty states (2 hours)
- [ ] Auto-redirect after registration (1 hour)
- [ ] Complete missing translations (2 hours)

**Total Estimated Time:** 19.5 hours

---

### Phase 3: Post-Launch Polish (Ongoing)

**UI Polish:**
- [ ] Standardize button sizes (2 hours)
- [ ] Add focus indicators (30 min)
- [ ] External link warnings (15 min)
- [ ] Fix map search form (15 min)
- [ ] Mobile upload form improvements (1 hour)
- [ ] Theme switcher state (30 min)
- [ ] Image optimization (1 hour)
- [ ] Edit form default values (15 min)

**Content & SEO:**
- [ ] Better metadata descriptions (30 min)
- [ ] Password reset expiry notice (15 min)
- [ ] Contact form privacy notice (30 min + policy page)
- [ ] Gallery alt text (15 min)

**Code Quality:**
- [ ] Remove commented code (30 min)
- [ ] Fix quote styles with Prettier (15 min)
- [ ] Remove unused imports (15 min)
- [ ] Add favicon (30 min)

**Nice-to-haves:**
- [ ] Breadcrumb navigation (1 hour)
- [ ] Print styles (30 min)
- [ ] Analytics event tracking (1 hour)
- [ ] Color contrast audit (1 hour)
- [ ] API rate limit feedback (2 hours if API supports)

**Total Estimated Time:** 13 hours

---

## Testing Checklist

### Before Production Deployment

#### Accessibility Testing
- [ ] Run Lighthouse accessibility audit (target: 90+)
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Verify all interactive elements have ARIA labels
- [ ] Test keyboard-only navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Check color contrast ratios with WebAIM tool
- [ ] Ensure all images have meaningful alt text
- [ ] Verify form fields have proper labels and descriptions
- [ ] Test focus indicators are visible

#### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

#### Device Testing
- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (iPad, Android tablet)
- [ ] Mobile (iPhone, Android phone)
- [ ] Test portrait and landscape orientations

#### Performance Testing
- [ ] Run Lighthouse performance test (target: 80+)
- [ ] Test on slow 3G connection
- [ ] Verify image loading performance
- [ ] Check bundle size (target: under 250KB initial)
- [ ] Test Time to Interactive (TTI)
- [ ] Verify no console.log statements in production

#### Security Testing
- [ ] Verify no sensitive data in console
- [ ] Check Google Maps API key restrictions
- [ ] Test rate limiting on API endpoints
- [ ] Verify CSRF protection on forms
- [ ] Check environment variables are properly configured
- [ ] Test SQL injection prevention
- [ ] Verify password hashing (bcrypt)
- [ ] Test session management

#### Functional Testing
- [ ] **User Registration Flow**
  - Create account with valid data
  - Test duplicate email/username errors
  - Test password requirements
  - Verify auto-redirect to sign in

- [ ] **Authentication Flow**
  - Sign in with valid credentials
  - Test invalid email error
  - Test invalid password error
  - Test "Remember Me" functionality
  - Test sign out

- [ ] **Password Reset Flow**
  - Request reset email
  - Click reset link
  - Set new password
  - Verify token expiration
  - Test invalid token handling

- [ ] **Map Feature**
  - View all markers
  - Filter by species name
  - Toggle between all/my finds
  - Click map to set location
  - Upload new image with GPS
  - Edit existing marker (own only)
  - View marker images
  - Test on mobile (touch interactions)

- [ ] **Gallery Feature**
  - View ND Gallery (Instagram)
  - Switch to User Gallery
  - View own uploaded images
  - Test empty state
  - Test image loading

- [ ] **Finder Game**
  - Start game
  - Answer questions
  - View progress indicator
  - Complete game
  - See final score

- [ ] **API Key Management**
  - Create new API key
  - Copy key to clipboard
  - View key list
  - Revoke key (with confirmation)
  - Test key expiration notice

#### Error Handling
- [ ] Test network errors (disconnect during API call)
- [ ] Test server errors (500 response)
- [ ] Test validation errors on forms
- [ ] Verify error boundaries catch crashes
- [ ] Test file upload errors (too large, wrong type)
- [ ] Test database connection errors

#### Internationalization
- [ ] Test all pages in English
- [ ] Test all pages in French
- [ ] Verify language switcher works
- [ ] Check all text is translated (no hardcoded strings)
- [ ] Test date/number formatting in both locales

#### Mobile-Specific
- [ ] Test touch gestures on map
- [ ] Verify upload form is usable
- [ ] Test navigation menu on small screens
- [ ] Verify all buttons are tappable (min 44x44px)
- [ ] Test image upload from camera
- [ ] Verify forms work with on-screen keyboard

---

## Quick Reference

### By Priority

**Must Fix Before Launch (Critical):**
1. Console.log statements
2. ARIA labels
3. Environment variables
4. Loading states
5. Form validation
6. Error boundaries
7. Password toggles
8. Confirmation dialogs

**Should Fix Before Launch (High):**
9-23: UX improvements, empty states, redirects

**Can Fix After Launch (Medium/Low):**
24-47: Polish, SEO, analytics, code cleanup

---

### By Estimated Time

**Quick Wins (< 1 hour):**
- Remove console.logs (30m)
- Auto-dismiss success (30m)
- Gallery toggle (30m)
- Navigation icons (30m)
- API key copy (30m)
- Finder progress (30m)
- Focus indicators (30m)
- External link icons (15m)
- Map search form (15m)
- Password reset expiry (15m)
- API dialog emphasis (15m)
- Gallery alt text (15m)
- Edit form defaults (15m)
- Commented code (30m)
- Prettier (15m)
- Unused imports (15m)
- Favicon (30m)
- Print styles (30m)

**Medium Tasks (1-4 hours):**
- ARIA labels (6h)
- Form validation (4h)
- Map UX (2h)
- MapMarker fixes (2h)
- Keyboard shortcuts (2h)
- Empty states (2h)
- Button standardization (2h)
- Translations (2h)

**Longer Projects (4+ hours):**
- Full accessibility audit and testing
- Cross-browser testing
- Mobile responsiveness overhaul

---

## Notes

- **Estimated total time to production-ready:** 55 hours (Phase 1 + Phase 2)
- **This does not include testing time:** Add 16-20 hours for comprehensive testing
- **Prioritize based on your timeline:** Focus on Critical and High priority first
- **Can be broken into multiple sessions:** Each issue is independent
- **Consider getting help:** Accessibility work might benefit from expert review

---

## Progress Tracking

Use this checklist format for tracking:

```
## Current Sprint: [Date Range]

### In Progress
- [ ] Issue #1: Console.log removal (ETA: 30m)

### Completed
- [x] Issue #42: Favicon added (30m)

### Blocked
- [ ] Issue #35: Rate limit feedback (waiting for Go API endpoint)
```

---

## Session Notes

### Session 1 - November 29, 2025
**Time Invested:** ~3 hours
**Issues Completed:** 4/8 critical issues (50%)

**Completed:**
1. ✅ Console.log removal from all client-side code
2. ✅ Error boundaries with branding (map, gallery, finder, global)
3. ✅ Environment variable fix (map API fetch bug resolved)
4. ✅ Loading states for map data refresh with visual feedback

**Key Wins:**
- Map refresh now works correctly (was returning 404 before)
- New markers appear immediately after upload
- Users get clear feedback when map updates
- Graceful error handling prevents white screen crashes

**Next Session Priorities:**
1. ARIA labels for accessibility (6 hours)
2. Form validation (4 hours)
3. Password show/hide toggle (2 hours)
4. Confirmation dialogs (1 hour)

---

### Session 2 - November 30, 2025
**Time Invested:** ~1.5 hours
**Issues Completed:** 1 high priority issue

**Completed:**
1. ✅ Issue #11: Map interaction usability improvements

**Key Wins:**
- Temporary blue marker provides visual feedback when clicking map
- Upload button disabled until all required fields complete (species name + coordinates)
- "Clear Location" button allows users to reset their selection
- Mobile-friendly implementation - no cluttered UI elements
- Form validation naturally guides users to complete required fields

**Next Session Priorities:**
1. Continue with remaining critical issues (#2, #5, #7, #8)
2. High priority issues from Phase 2

---

**Document Version:** 1.2
**Last Updated:** November 30, 2025 -redeploy
**Next Review:** After Phase 1 completion (4 more critical issues)
