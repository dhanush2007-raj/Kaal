# Kaal

Kaal is a desktop productivity app for focused work. It puts a focus timer, tasks, notes, reminders, goals, file storage, a music player and a chat assistant in one window. On Windows it can also silence notifications and close distracting apps while a focus session runs.

The name "Kaal" means "time" in Hindi.

**Try it online:** https://dhanush2007-raj.github.io/Kaal/

> **Warning: Kaal is still in development.**
>
> - Features may change, break or be removed without notice.
> - The cloud connection (Google Drive upload) is currently linked to the developer's account. Files you upload there may be visible to the developer.
> - Do not upload private, personal or sensitive files. Use **Save Locally** instead.

## Screenshots

### Dashboard

<img width="959" height="599" alt="Screenshot 2026-11-24 112104" src="https://github.com/user-attachments/assets/e9a43768-58e2-4262-bd09-35f19c5238ff" />


### Focus Timer

<img width="959" height="599" alt="Screenshot 2026-11-24 112131" src="https://github.com/user-attachments/assets/dd619239-0f89-44ef-bb9f-5c820c766197" />


### Files and Goals

<img width="956" height="599" alt="Screenshot 2026-11-24 112142" src="https://github.com/user-attachments/assets/4c9a9cc5-22de-4c73-9e91-1d594674f4c8" />


## Features

- **Dashboard:** counts of tasks done, focus sessions, notes written and reminders. It also shows pending tasks, upcoming reminders, focused time and completion rate.
- **Quick note:** save a thought straight from the dashboard.
- **Tasks:** add tasks with a due date and a category (Work, Personal, Urgent, Health), and filter them by category.
- **Focus timer:** a stopwatch-style timer with Focus, Short Break and Long Break modes. It has custom lengths, the presets Classic 25/5 and Flow 50/10, and a session counter. A floating timer can shrink to a mini view.
- **Clock:** an analog and digital clock.
- **Notes:** write, search and view notes.
- **Reminders:** set reminders with a date and time, with an alert sound.
- **Files and goals:** drop in files, then choose **Save Locally** or **Upload to Google Drive**. Track goals with a progress slider.
- **Music player:** an iPod-style player with a song library and drag-and-drop.
- **Chat assistant:** a floating chat panel inside the app.
- **Data export:** export your data as JSON or as an HTML report.
- **Responsive layout:** a sidebar on desktop and a bottom navigation bar on small screens.

## Platform support

| Feature | Windows | macOS |
| --- | --- | --- |
| Run from source (`npm start`) | Yes | Yes |
| Tasks, timer, notes, reminders, goals, music, export | Yes | Yes |
| Silence notifications during focus | Yes | No |
| Close blocked apps during focus | Yes | No |
| Installer build | Yes (`npm run pack:win`) | Not set up |

### Windows focus mode

When a focus session starts, the Windows app can do two things:

- Turn off Windows toast notifications.
- Check running processes every 2 seconds and force-close any app on your block list.

Both are undone when the session stops or the window closes.

### Using Kaal on macOS

The app is built with Electron, so the interface runs on a Mac. The focus mode code only knows Windows commands (`powershell`, `tasklist`, `taskkill`). On a Mac those commands do not exist, so the focus timer works but silencing notifications and blocking apps do nothing. I have not tested Kaal on a Mac.

Other limits on macOS:

- There is no Mac installer script yet. The project only has a Windows build command.
- A Mac build has to be made on a Mac.
- An unsigned Mac app shows a security warning when opened. Removing it needs a paid Apple Developer account.
- The window icon file `icon.png` is not in the repo.

## Requirements

- Node.js and npm
- Windows 10 or 11 for focus mode and the installer
- An internet connection, because the icons, fonts and alert sound are loaded from the web

## Run from source

```bash
git clone https://github.com/dhanush2007-raj/Kaal.git
cd Kaal
npm install
npm start
```

## Build a Windows installer

```bash
npm run pack:win
```

The installer is written to the `dist` folder. The build configuration expects an `icon.ico` file in the project root.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | The whole interface: markup, styles and app logic |
| `main.js` | Electron main process, notification toggle and app blocker |
| `preload.js` | Safe bridge between the interface and the main process |
| `package.json` | Scripts, dependencies and installer settings |
| `capacitor.config.json` | Capacitor settings for a possible mobile build |
| `LICENSE` | ISC license |

## Known limitations

- Focus mode closes blocked apps immediately. Unsaved work in those apps is lost, so save before you start a session.
- If Kaal crashes during a session, Windows notifications may stay off. Turn them back on in Windows Settings.
- App names on the block list must match the process name, for example `chrome.exe`.
- The mobile build through Capacitor is not set up yet.

## License

Released under the [MIT License](LICENSE).
