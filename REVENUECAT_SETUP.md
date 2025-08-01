# RevenueCat Setup Guide

This guide will help you set up RevenueCat for subscription management in your React Native app.

## Prerequisites

- RevenueCat account (https://www.revenuecat.com/)
- Apple Developer Account (for iOS)
- Google Play Console account (for Android)
- React Native project with `react-native-purchases` already installed

## Step 1: RevenueCat Dashboard Setup

### 1.1 Create a RevenueCat Project
1. Log in to your RevenueCat dashboard
2. Create a new project
3. Note down your API keys for iOS and Android

### 1.2 Configure Products
1. Go to "Products" in your RevenueCat dashboard
2. Add your subscription products:
   - Monthly subscription
   - Yearly subscription
   - Lifetime access (if applicable)
3. Note down the Product IDs

### 1.3 Configure Entitlements
1. Go to "Entitlements" in your RevenueCat dashboard
2. Create an entitlement called "premium_access"
3. Link your products to this entitlement

## Step 2: Update Configuration

### 2.1 Update API Keys
Edit `src/config/revenueCat.js` and replace the placeholder API keys:

```javascript
const REVENUECAT_API_KEYS = {
  ios: 'your_actual_ios_api_key_here',
  android: 'your_actual_android_api_key_here'
};
```

### 2.2 Update Product IDs
Update the product IDs in `src/config/revenueCat.js`:

```javascript
export const PRODUCT_IDS = {
  MONTHLY_SUBSCRIPTION: 'your_monthly_product_id',
  YEARLY_SUBSCRIPTION: 'your_yearly_product_id',
  LIFETIME_ACCESS: 'your_lifetime_product_id'
};
```

### 2.3 Update Entitlement IDs
Update the entitlement IDs if needed:

```javascript
export const ENTITLEMENT_IDS = {
  PREMIUM_ACCESS: 'premium_access' // or your custom entitlement ID
};
```

## Step 3: iOS Setup

### 3.1 App Store Connect
1. Log in to App Store Connect
2. Create your app if not already created
3. Go to "Features" > "In-App Purchases"
4. Create subscription products matching your RevenueCat configuration
5. Note down the Product IDs

### 3.2 Xcode Configuration
1. Open your iOS project in Xcode
2. Go to "Signing & Capabilities"
3. Add "In-App Purchase" capability
4. Ensure your Bundle ID matches App Store Connect

### 3.3 Testing
1. Create sandbox test accounts in App Store Connect
2. Use these accounts for testing purchases
3. Test on a physical device (simulator doesn't support in-app purchases)

## Step 4: Android Setup

### 4.1 Google Play Console
1. Log in to Google Play Console
2. Create your app if not already created
3. Go to "Monetization" > "Products" > "Subscriptions"
4. Create subscription products matching your RevenueCat configuration
5. Note down the Product IDs

### 4.2 Android Manifest
Ensure your `android/app/src/main/AndroidManifest.xml` includes:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
```

### 4.3 Testing
1. Upload your app to internal testing track
2. Add test accounts in Google Play Console
3. Test purchases using test accounts

## Step 5: Testing the Integration

### 5.1 Test Purchase Flow
1. Run your app
2. Navigate to a course detail screen
3. Tap "Buy Now"
4. Select a subscription plan
5. Complete the purchase flow
6. Verify subscription status updates

### 5.2 Test Restore Purchases
1. Go to Subscription Management screen
2. Tap "Restore Purchases"
3. Verify previous purchases are restored

### 5.3 Test Subscription Status
1. Check subscription status in the app
2. Verify access to premium content
3. Test subscription expiration handling

## Step 6: Production Deployment

### 6.1 App Store
1. Submit your app to App Store Review
2. Ensure all subscription products are approved
3. Test with real purchases after approval

### 6.2 Google Play Store
1. Submit your app to Google Play Console
2. Ensure all subscription products are active
3. Test with real purchases after publication

## Troubleshooting

### Common Issues

1. **"Product not found" error**
   - Verify product IDs match between RevenueCat and app stores
   - Ensure products are approved and active

2. **"User not found" error**
   - Check RevenueCat API keys
   - Verify user ID is being passed correctly

3. **Purchase not completing**
   - Check network connectivity
   - Verify app store account has valid payment method
   - Check for sandbox/test account issues

### Debug Mode
Enable debug logging by setting `observerMode: true` in the RevenueCat configuration for testing without making actual purchases.

## Support

For additional help:
- RevenueCat Documentation: https://docs.revenuecat.com/
- RevenueCat Support: https://www.revenuecat.com/support/
- React Native Purchases: https://github.com/RevenueCat/react-native-purchases

## Files Modified

The following files have been created or modified for RevenueCat integration:

1. `src/config/revenueCat.js` - RevenueCat configuration and service
2. `src/context/SubscriptionProvider.js` - Global subscription state management
3. `src/hooks/useSubscription.js` - Custom hook for subscription operations
4. `src/screens/Courses/Plans/PlansScreen.js` - Updated to use RevenueCat
5. `src/screens/Courses/courseDetail/CourseDetailScreen.js` - Updated buy button
6. `src/screens/Settings/Subscription/SubscriptionManagementScreen.js` - New subscription management screen
7. `App.js` - Added SubscriptionProvider wrapper
8. `REVENUECAT_SETUP.md` - This setup guide 