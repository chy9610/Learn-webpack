import "./static/index.less";
import testHeader from "@public/assets/test-header.jpeg";

class Test {
  constructor() {
    // document.write("Constructor");
    this.renderDiv();
    this.renderImg();
  }

  renderDiv() {
    const div = document.createElement("div");
    div.className = "test";
    div.innerHTML = "Hello Word";
    document.body.appendChild(div);
  }
  renderImg() {
    const img = document.createElement("img");
    img.src = testHeader;
    document.body.appendChild(img);
  }
}

new Test();
