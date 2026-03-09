# Specification

## Summary
**Goal:** Build "Jeevan Rakshak," a warm Hindi/Hinglish health companion app with heart rate monitoring, emergency alerts, medicine reminders, symptom checking, and a user medical profile — all with a caring teal-and-saffron visual theme designed for elderly users.

**Planned changes:**
- **Backend data model & API:** Store and retrieve user medical profile (name, age, emergency contact, medical history, allergies) and a medicine list (name, dosage, schedule times, importance description). Log emergency events and symptom check sessions.
- **Dashboard:** Header showing user name, medical summary badge (e.g., "Diabetic | BP Patient"), and heart rate panel with live simulated BPM (60–100, updates every 2 seconds), pulsing heart animation synced to BPM, and manual BPM input for testing.
- **Emergency alert flow:** When BPM ≤ 40 or 0, trigger a Web Audio API alarm, show a full-screen Hinglish overlay ("Kya aap theek hain? Kripya screen touch karein ya Haan bolein") with a 10-second countdown. Tap/click or "Haan" dismisses and logs a false alarm. If no response, show "Emergency Activated" screen with simulated "Calling 108...", "Location Shared" messages, emergency contact, and medical history summary.
- **Medicine Reminder screen:** Add/edit/delete medicines with name, dosage, schedule times, and importance description. Frontend reminder engine shows a Hinglish modal at scheduled times; repeats every 5 minutes until "Le Li (Taken)" is confirmed. "Baad Mein" re-triggers after 5 minutes. "Nahi Lunga" shows importance explanation. Daily dose log stored in backend.
- **Symptom Checker chat panel:** Conversational Hinglish chat UI named "Jeevan Rakshak." Greets user, confirms they are a patient, shows quick-reply symptom chips (Bukhar, Khansi, Dard, Kamzori, Aur). Returns rule-based care suggestion in Hinglish with AI disclaimer ("Main ek AI hoon — doctor se milna sabse zaroori hai"). Sessions stored in backend.
- **User Profile setup screen:** Fields for name, age, emergency contact, chronic conditions, allergies, and optional profile photo. Data persisted to backend and surfaced on dashboard header.
- **Visual theme:** Deep teal + warm saffron/amber palette, minimum 16px body / 20px+ headings, rounded cards, subtle gradients, clear iconography, no blue/purple as primary colors. App name and heart icon prominent in header. Dashboard and emergency screens use custom background images.

**User-visible outcome:** Users can set up their medical profile, monitor a simulated live heart rate with automatic emergency alerts, receive warm Hinglish medicine reminders, check symptoms via a conversational chat, and experience a fully themed, elderly-friendly health companion app in Hinglish.
