# PeachWish 💖

> Create and share sweet, personalized, and ephemeral surprise wish pages with your loved ones in a premium peach-and-cream aesthetic.

![PeachWish Presentation Mockup](/public/assets/peachwish_mockup.jpg)

---

## 🌸 The Concept

**PeachWish** is a full-stack, secure, ephemeral surprise web application designed to help friends and families send personalized, animated digital celebration cards. Built with a sophisticated, warm pastel-peach visual identity, PeachWish combines nostalgia with modern web engineering.

Unlike typical greeting platforms that clutter the web forever, PeachWish respects user privacy and digital clutter. Senders can customize their messages, upload a gorgeous Polaroid memories scrapbook, and specify a precise **security time limit (defaulting to 3 Hours)**. Once the time is up, the link gracefully expires forever, self-cleaning from active access.

---

## ✨ Features

### 🎮 Senders' Creation Dashboard
* **Tailored Personalization**: Set recipient names, compose beautiful multi-line wishes, and preview layouts before sending.
* **Security Time Limits**: Secure drop-down picker to set precise link lifespans:
  * `3 Hours` (Sweet Moment — **Default**)
  * `12 Hours` (Half Day)
  * `24 Hours` (Full Day)
  * `7 Days` (Extended Joy)
* **Memories Scrapbook**: Seamless photo attachment support (under 2MB each) allowing creators to write custom captions beneath classic Polaroid cards.
* **Instant Sharing & QR Codes**: One-click URL generation, reactive link clipboard copying, and instantly downloadable custom QR codes for direct scan-to-view surprises.

### 🗃️ Active "My Wishes" History
* **Local Storage Caching**: Keeps a history of your generated wishes stored securely and locally on your browser.
* **Real-time Countdown Indicators**: Dynamic, reactive count timers displaying remaining validity down to the exact second.
* **Instant Revocation**: Complete remote deletion. Senders can revoke access immediately—instantly deactivating the link on the server.

### 🎈 Receivers' Surprise Portal
* **Interactive Lighting Control**: Recipient starts in a soft twilight with a hanging lightbulb. Clicking the bulb turns on the lights and initiates the celebration.
* **Dynamic Physics Balloon Engine**: Interactive colorful balloons float up with realistic randomized motion and velocities.
* **Synchronized Audio Experience**: Elegant background soundtrack integrated seamlessly, launching on lightbulb click.
* **Dynamic CSS Card Animations**: Words fade and slide in with premium typographic spacing and fluid timing.
* **Polaroid Scrapbook Drawer**: If the sender uploaded a photo album, an elegant **"Open Our Memories"** CTA button appears, opening a beautiful light-box polaroid slideshow. If no album was attached, this option is strictly and cleanly hidden.

---

## 🛠️ Tech Stack & Architecture

PeachWish is built using a modern full-stack Next.js 15 applet architecture:

* **Framework**: Next.js 15+ (App Router)
* **Programming Language**: TypeScript
* **Styling**: Tailwind CSS v4 & Custom Animations
* **Animations**: Framer Motion & CSS Keyframes
* **Storage**: Node.js File System Database (`wishes_db.json`)
* **Icons**: Lucide React & High-fidelity Custom SVGs

### 📡 Data Flow & Request Lifecycle

```text
 [ Creator Dashboard ]                      [ Database (JSON) ]                     [ Surprise Portal ]
          |                                          |                                       |
          |  1. POST /api/wishes/create             |                                       |
          |----------------------------------------->|                                       |
          |  (Stores message, expiry, album)         |                                       |
          |                                          |                                       |
          |  2. Returns unique link ID               |                                       |
          |<-----------------------------------------|                                       |
          |                                          |                                       |
          |                                          |  3. GET /api/wishes/check?id=123      |
          |                                          |<--------------------------------------|
          |                                          |                                       |
          |                                          |  4. Evaluates expiry time / deletion  |
          |                                          |-------------------------------------->|
          |                                          |  (Returns active data OR 'Expired')   |
```

---

## 🔌 API Endpoints

### 1. Create a Wish
* **Endpoint**: `/api/wishes/create`
* **Method**: `POST`
* **Request Body**:
```json
{
  "name": "Alex",
  "message": "Happy Birthday!\nWishing you an amazing year ahead!",
  "expiry": "3h",
  "album": [
    {
      "imageUrl": "data:image/png;base64,...",
      "caption": "Our summer trip"
    }
  ]
}
```
* **Response (200 OK)**:
```json
{
  "id": "e4d3a8f5-9382-410a-b32c-7b49d8a3a2f9",
  "timestamp": 1789588404000
}
```

### 2. Check Wish Status & Content
* **Endpoint**: `/api/wishes/check`
* **Method**: `GET`
* **Parameters**: `?id=<unique-wish-id>`
* **Response (200 OK - Active)**:
```json
{
  "valid": true,
  "name": "Alex",
  "message": "Happy Birthday!\nWishing you an amazing year ahead!",
  "album": [
    {
      "imageUrl": "data:image/png;base64,...",
      "caption": "Our summer trip"
    }
  ]
}
```
* **Response (200 OK - Expired / Non-Existent)**:
```json
{
  "valid": false,
  "message": "This wish is expired or was deleted."
}
```

### 3. Revoke / Delete a Wish
* **Endpoint**: `/api/wishes/delete`
* **Method**: `POST`
* **Request Body**:
```json
{
  "id": "e4d3a8f5-9382-410a-b32c-7b49d8a3a2f9"
}
```
* **Response (200 OK)**:
```json
{
  "success": true
}
```

---

## 🚀 Running Locally

Follow these instructions to spin up the development environment on your local machine:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to view the application.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Security & Privacy Features
1. **Dynamic Ephemerality**: Expiry calculations are enforced server-side. Once the countdown expires, the content is purged dynamically from the API check responses.
2. **Revocation Rights**: Deleting a wish completely clears its entry from the database file on the server.
3. **Lazy Memory Allocations**: Images are securely converted, stored, and loaded via dynamic JSON streams, with built-in asset optimizations and sizes capped for performant response times.
