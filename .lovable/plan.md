## Plan: Sitemap erweitern & robots.txt korrigieren

### 1. `public/robots.txt` aufräumen
Die `Disallow`-Regeln für `/impressum` und `/datenschutz` entfernen. Diese Seiten sollen für Suchmaschinen erreichbar sein (Impressum ist in DE Pflichtangabe, wird üblicherweise indexiert).

Neu:
```
User-agent: *
Allow: /
```

### 2. Sitemap vervollständigen
`src/routes/sitemap[.]xml.ts` enthält bereits alle Hauptseiten. Die rechtlichen Pflichtseiten ergänzen, damit sie sauber im Index landen:
- `/impressum` (priority 0.3, changefreq yearly)
- `/datenschutz` (priority 0.3, changefreq yearly)

`BASE_URL` bleibt leer — die Sitemap ermittelt den Host automatisch aus dem Request, funktioniert also sowohl auf der `.lovable.app`-Preview als auch nach Anbindung der Custom-Domain `connected-webdesign.de`.

### Hinweis
Damit ist die Seite bereit fürs Veröffentlichen. Nach dem Publish lohnt es sich, die Sitemap-URL (`https://<domain>/sitemap.xml`) in der Google Search Console einzureichen.