import React from "react";
import PDFLib, { PDFDocument, PDFPage } from "react-native-pdf-lib";

class PDFGenerator {
  contructor() {}

  async save(messages) {
    const report = PDFPage.create().setMediaBox(250, 250);

    for (var idx in messages.reverse()) {
      console.log(
        messages[idx]["user"]["name"] + " : " + messages[idx]["text"]
      );
      report.drawText(
        messages[idx]["user"]["name"] + " : " + messages[idx]["text"]
      );
    }
    const docsDir = await PDFLib.getDocumentsDirectory();
    const pdfPath = `${docsDir}/qaid_report.pdf`;

    PDFDocument.create(pdfPath)
      .addPages(report)
      .write() // Returns a promise that resolves with the PDF's path
      .then((path) => {
        console.log("PDF created at: " + pdfPath);
      })
      .catch((err) => console.log("failed to generate pdf", err));
  }
}

module.exports.PDFGenerator = PDFGenerator;
