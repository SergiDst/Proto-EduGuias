import type { CuestionarioPayload } from "@/interfaces/actividades";
import { generateHtmlActivity } from "./generateHtml";

// We'll use JSZip dynamically (available via CDN or npm)
export async function generateScormPackage(
    payload: CuestionarioPayload,
    title: string,
    subject: string
): Promise<Blob> {
    // Dynamically import JSZip
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    const htmlContent = generateHtmlActivity(payload, title, subject);

    // imsmanifest.xml - SCORM 1.2
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.eduguias.${Date.now()}" version="1.1"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2
    imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1
    imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2
    adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="eduguias_org">
    <organization identifier="eduguias_org">
      <title>${title.replace(/[<>&'"]/g, " ")}</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>${title.replace(/[<>&'"]/g, " ")}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent"
      adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

    // Wrap HTML with SCORM API communication
    const scormWrapped = htmlContent.replace(
        "</head>",
        `<script>
// SCORM 1.2 communication wrapper
var _SCORM_API = null;
function _findAPI(win) {
  var findAttempts = 0;
  while (!win.API && win.parent && win.parent != win && findAttempts <= 500) {
    findAttempts++;
    win = win.parent;
  }
  return win.API || null;
}
function getAPI() {
  if (_SCORM_API) return _SCORM_API;
  _SCORM_API = _findAPI(window);
  if (!_SCORM_API && window.opener) _SCORM_API = _findAPI(window.opener);
  return _SCORM_API;
}
function scormInit() {
  var api = getAPI();
  if (api) {
    api.LMSInitialize("");
    api.LMSSetValue("cmi.core.lesson_status", "incomplete");
  }
}
function scormFinish(score) {
  var api = getAPI();
  if (api) {
    var normalized = Math.round(score);
    api.LMSSetValue("cmi.core.score.raw", normalized.toString());
    api.LMSSetValue("cmi.core.score.min", "0");
    api.LMSSetValue("cmi.core.score.max", "100");
    api.LMSSetValue("cmi.core.lesson_status", normalized >= 60 ? "passed" : "failed");
    api.LMSSetValue("cmi.core.exit", "");
    api.LMSCommit("");
    api.LMSFinish("");
  }
}
window.addEventListener("load", scormInit);
<\/script>
</head>`
    );

    // Patch finishActivity to report score to SCORM
    const scormFinalActivity = scormWrapped.replace(
        "document.getElementById('scoreCircle').textContent = pct + '%';",
        `document.getElementById('scoreCircle').textContent = pct + '%';
      scormFinish(pct);`
    );

    zip.file("imsmanifest.xml", manifestXml);
    zip.file("index.html", scormFinalActivity);

    return zip.generateAsync({ type: "blob", mimeType: "application/zip" });
}
