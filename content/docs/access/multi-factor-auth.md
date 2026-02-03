---
title: Multi-Factor Authentication
description: Secure your Railway account with multi-factor authentication using authenticator apps or passkeys.
---

Multi-factor authentication (MFA) adds an extra layer of security to your Railway account by requiring a second verification step when signing in.

Railway supports two MFA methods:
- **Authenticator App** - Use a time-based one-time password (TOTP) from an authenticator app
- **Passkeys** - Use your device's built-in authentication (fingerprint, face recognition, or PIN)

## Authenticator App

Use an authenticator app like Google Authenticator, Authy, or 1Password to generate time-based verification codes.

### Setup

1. Go to your [Account Security Settings](https://railway.com/account/security) page
2. Click the **Set up two-factor authentication** button
3. Scan the QR code with your authenticator app
4. Enter the verification code from your authenticator app to confirm setup

Once enabled, you'll need to enter a code from your authenticator app each time you sign in. 

### Recovery Codes

After setting up two-factor authentication, you'll receive a set of recovery codes. These codes serve as an alternative login method if you lose access to your authenticator app or are unable to receive a verification code.

<Banner variant="warning">
**Treat recovery codes like passwords.** Store them in a safe place. You'll need them if you lose access to your authenticator app.
</Banner>

Each recovery code can only be used once. If you've used most of your codes, you can generate a new set from your account settings.

## Passkeys

Passkeys use your device's built-in authentication (such as fingerprint, face recognition, or PIN) as a second verification step.

### Setup

1. Go to your [Account Security Settings](https://railway.com/account/security) page
2. Click the **Add Passkey** button
3. Follow your device's prompts to register the passkey

### Benefits

- Phishing-resistant - Passkeys are bound to specific websites and can't be used on fake sites
- No codes to enter - Authentication happens automatically with your device
- Cross-device support - Many passkeys can be synced across your devices via iCloud Keychain, Google Password Manager, or similar services

## Managing MFA

You can manage your MFA settings at any time from your [Account Security Settings](https://railway.com/account/security) page:

- View and regenerate recovery codes
- Add or remove passkeys
- Disable two-factor authentication (not recommended)

## Team Enforcement

Team administrators can require all team members to have MFA enabled. See [Two-Factor Enforcement](/access/two-factor-enforcement) for details.