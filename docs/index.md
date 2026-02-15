---
layout: home

hero:
  name: slidev-addon-d2
  text: D2 Diagrams in Slidev
  tagline: Write D2 in fenced code blocks, get rendered SVGs in your slides.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Live Demo
      link: /demo/
      target: _blank

features:
  - title: Beautiful Diagrams
    details: Full D2 language support — flowcharts, sequence diagrams, containers, styling, and more.
  - title: Zero Config
    details: Add the addon, write a ```d2 code block, done. No CLI tools to install.
  - title: WASM Powered
    details: Renders entirely in the browser using the official @terrastruct/d2 WASM package.
  - title: Dark Mode
    details: Diagrams automatically switch themes when you toggle Slidev's dark mode.
---

<style>
.demo-container {
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}
.demo-container h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.demo-frame {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}
.demo-frame iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>

<div class="demo-container">

## See it in action

<div class="demo-frame">
  <iframe src="/slidev-addon-d2/demo/" loading="lazy" allow="fullscreen"></iframe>
</div>

</div>
