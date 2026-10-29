# Key Surveillance Camera Systems

Field installation and setup manual from a research grant covering security consulting workflows for CCTV, access control, NVR platforms, and network fundamentals.

## Open the guide

Open `index.html` in a browser (double-click, or serve locally):

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## Landing page integration

This manual is styled to drop into [sdcastillo/landingpage](https://github.com/sdcastillo/landingpage) as:

`https://www.predictiveinsightsai.com/key-survaillance-camera-systems-main/`

It includes the shared site header/footer (Samuel Castillo nav, Research/About menus, Linktree QR, translate widget). Site chrome asset paths (`/assets/...`, `/homeindex.html`) resolve on the live domain; local preview keeps the reader chrome working either way.

## What’s included

- Camera types and IoT / network fundamentals
- ExacqVision, Avycon, and Camect Hub procedures
- Kantech / EntraPass access-control tutorials
- Genetec and Avigilon product overviews
- Cable runoff estimation and floor-plan wire mapping

## App features

- Dark-themed reading layout with sticky table of contents
- Full-text search across procedures
- Reading progress indicator
- Mobile-first responsive layout (drawer TOC, stacked CTAs, safe-area padding)

## Source notes

`book.md` is the markdown source companion. The interactive reader is `index.html` with `style.css` and `app.js`.
