// ============================================
//  CONFIGURACION — ALUM-NA
//  Este archivo va junto a index.html.
// ============================================

// 1) La URL del web app de Apps Script. Termina en /exec
//    Si vuelves a implementar y cambia, se cambia aqui.
const API_URL = 'https://script.google.com/macros/s/AKfycbydPDWks9H6U0DFomh-7XBJU7v4l-5912HDAjK94MRfbBhIfx7rhwxY0QM9wgB-GnQC/exec';

// 2) Sugerencia de donde bajar el modelo de recorte con IA.
//    OJO: el modelo NO se sube al repositorio. Se instala desde la propia
//    pagina, con el boton "Modelo de IA...", y se queda guardado dentro del
//    navegador. Esta linea solo llena la casilla de "Bajarlo de internet".
//    Dejala vacia ('') si prefieres poner el archivo siempre a mano.
const MODELO_IA = 'https://huggingface.co/Heliosoph/u2net-onnx/resolve/main/u2netp.onnx';

// 3) Como se preparan los pixeles antes de entrar al modelo.
//    'u2net'  para u2netp, u2net y u2net_human_seg
//    'isnet'  para isnet-general-use
const MODELO_TIPO = 'u2net';
