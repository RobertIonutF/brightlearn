import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';

export async function extractTextFromPPT(buffer: ArrayBuffer): Promise<string> {
  try {
    const zip = new JSZip();
    await zip.loadAsync(buffer);
    
    const slideFiles = Object.keys(zip.files).filter(fileName => 
      fileName.startsWith('ppt/slides/slide') && fileName.endsWith('.xml')
    );

    let text = '';
    const parser = new XMLParser();

    for (const slideFile of slideFiles) {
      const slideContent = await zip.file(slideFile)?.async('text');
      if (slideContent) {
        const parsed = parser.parse(slideContent);
        const slideText = extractTextFromParsedSlide(parsed);
        text += `Slide ${slideFile.match(/\d+/)?.[0] || ''}:\n${slideText}\n\n`;
      }
    }

    return text;
  } catch (error) {
    console.error('Error extracting text from PPT:', error);
    throw new Error('Failed to extract text from PPT file');
  }
}

function extractTextFromParsedSlide(parsed: any): string {
  let text = '';
  if (parsed['p:sld'] && parsed['p:sld']['p:cSld'] && parsed['p:sld']['p:cSld']['p:spTree']) {
    const spTree = parsed['p:sld']['p:cSld']['p:spTree'];
    if (Array.isArray(spTree['p:sp'])) {
      for (const sp of spTree['p:sp']) {
        if (sp['p:txBody'] && sp['p:txBody']['a:p']) {
          const paragraphs = Array.isArray(sp['p:txBody']['a:p']) ? sp['p:txBody']['a:p'] : [sp['p:txBody']['a:p']];
          for (const paragraph of paragraphs) {
            if (paragraph['a:r'] && paragraph['a:r']['a:t']) {
              text += paragraph['a:r']['a:t'] + '\n';
            }
          }
        }
      }
    }
  }
  return text;
}