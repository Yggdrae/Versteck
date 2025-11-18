# 🛡️ Versteck

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey.svg)
![Stack](https://img.shields.io/badge/tech-React%20Native%20%7C%20Expo-violet.svg)

**Versteck** (German for _hiding place_ or _cache_) is a minimalist, **Zero-Knowledge**, offline-first password manager built with React Native and Expo.

It prioritizes security and privacy by ensuring that your data is encrypted locally on your device using military-grade standards. No servers, no cloud, no tracking. **You own your keys.**

---

## ✨ Features

- **Zero-Knowledge Architecture:** Your Master Key never leaves your device and is never stored.
- **Strong Encryption:** Uses **AES-256-GCM** for authenticated encryption.
- **Secure Key Derivation:** Uses **PBKDF2** (100,000 iterations, SHA-512) to protect against brute-force attacks.
- **Password Generator:** Configurable generator (length, special chars, numbers) for strong credentials.
- **Offline Storage:** Vault is stored as an encrypted JSON blob using the device's file system.
- **Clipboard Management:** Copy passwords securely with a single tap.
- **Dark/Light Mode:** Themed UI using React Native Paper.
- **Data Management:** Features to export backups and securely wipe all data.

---

## 🏗️ Tech Stack & Architecture

### Core Technologies

- **Framework:** React Native (Expo SDK 52+)
- **Language:** TypeScript
- **UI Library:** React Native Paper
- **State Management:** React Query (TanStack Query) & Context API
- **Package Manager:** Yarn (Recommended for native linking stability)

### Security Stack

This is the heart of the application. We use high-performance native modules to ensure encryption doesn't freeze the UI.

- **Cryptography:** `react-native-quick-crypto` (Fast C++ implementation of Node's crypto module).
- **Randomness:** `react-native-get-random-values` (CSPRNG).
- **File System:** `expo-file-system` (Modern File/Paths API).

### The "Save" Workflow

1.  **Read:** The encrypted file is read from the disk.
2.  **Decrypt:** The file is decrypted in memory using the session Key.
3.  **Modify:** The new password is added to the array in memory.
4.  **Encrypt:** The entire array is re-encrypted with a **new random Salt and IV**.
5.  **Write:** The old file is overwritten with the new encrypted blob.

---

## 🚀 Installation & Running

Prerequisites:

- Node.js
- **Yarn**

```bash
# 1. Clone the repository
git clone https://github.com/Yggdrae/Versteck.git
cd versteck

# 2. Install dependencies
yarn install

# 3. Run on Android (Development Build)
# Note: You cannot use Expo Go because of the native crypto libraries.
yarn android
```

## ⚠️ Important Security Notice

Versteck is a local-only vault.

If you forget your Master Key, your data is mathematically lost forever. There is no "Reset Password" button.

If you lose your device or uninstall the app without a backup, your passwords are gone.

Recommendation: Regularly use the "Export Backup" feature in Settings and store the encrypted file in a separate secure location.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request
