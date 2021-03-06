import React, {useState, useEffect, useRef} from 'react';
import './tailwind.output.css';
import * as PDFLib from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist/webpack';
import Viewer from './Viewer';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [picFiles, setPicFiles] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function effect() {
      if (!pdfFile) {
        return;
      }
      const url = URL.createObjectURL(pdfFile);
      setPdfUrl(url);
      const pdf = await pdfjs.getDocument(url).promise;
      const page = await pdf.getPage(1);
      const context = canvasRef.current.getContext('2d');
      const viewport = page.getViewport({scale: 0.5});
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      await page.render(renderContext).promise;
    }
    effect();
  }, [pdfFile, canvasRef])

  async function convert() {
    if (!picFiles.length || !pdfFile) {
      return;
    }

    // load pdf document
    let pdfBytes = await pdfFile.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(pdfBytes);
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let i = 0; i < picFiles.length; i++) {
      const picFile = picFiles[i];
      const picBytes = await picFile.arrayBuffer();
      const embeddedImage = await mergedPdf.embedPng(picBytes);
      embeddedImage.scale(0.1);
      const embeddedPage = await mergedPdf.embedPage(pdf.getPage(i));
      const pdfPage = mergedPdf.addPage();
      pdfPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width/2,
        height: embeddedImage.height/2,
      });
      pdfPage.drawPage(embeddedPage);
    }

    pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    window.location.href = window.URL.createObjectURL(blob);
  }

  return <>
    <label htmlFor="pdf-input">Choose PDF: </label><br/>
    <input type="file" id="pdf-input" name="pdf-input" accept=".pdf" onChange={ev => setPdfFile(ev.target.files[0])}/>
    <br/>
    <label htmlFor="pic-input" >Choose Pictures:</label><br/>
    <input type="file" id="pic-input" name="pic-input" accept=".png" multiple onChange={ev => setPicFiles(ev.target.files)}/>
    <br/>
    <button type="submit" onClick={convert}>Convert</button>
    <br/>
    <canvas id="le-canvas" ref={canvasRef}/>
    <br/>
    <Viewer pdfUrl={pdfUrl}/>
  </>
}

export default App;
