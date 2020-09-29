export class Modal {
  constructor(contentID, fallbackText) {
    this.fallbackText = fallbackText;
    this.contentTemplateEle = document.getElementById(contentID);
    this.modalTemplateEle = document.getElementById("modal-template");
  }
  show() {
    if ("content" in document.createElement("template")) {
      const modalElemets = document.importNode(
        this.modalTemplateEle.content,
        true
      );
      this.modalEle = modalElemets.querySelector(".modal");
      this.backdropEle = modalElemets.querySelector(".backdrop");
      const contentEle = document.importNode(
        this.contentTemplateEle.content,
        true
      );
      this.modalEle.append(contentEle);
      document.body.insertAdjacentElement("afterbegin", this.modalEle);
      document.body.insertAdjacentElement("afterbegin", this.backdropEle);
    } else {
      alert(this.fallbackText);
    }
  }
  hide() {
    this.modalEle.remove(); // body.removeChild(this.modalEle)
    this.backdropEle.remove();
  }
}
