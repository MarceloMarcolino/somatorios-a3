// ====== Cliente HTTP (Axios) ======
// Atende ao requisito do enunciado: "implementar uma requisicao HTTP simples
// (usando fetch ou axios) para buscar ou enviar dados simulados".
// Aqui buscamos DICAS matematicas simuladas servidas pelo proprio app (public/dicas.json).
//
// E o mesmo padrao ensinado na apostila 07 da UC (axios.create com baseURL).
// Para usar uma API real, bastaria trocar a baseURL e o endpoint abaixo.

import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.PUBLIC_URL || '', // raiz da pasta public no Create React App
});

// Retorna uma Promise com o array de dicas. Lembre: no axios o corpo vem em resposta.data.
export function buscarDicas() {
  return apiClient.get('/dicas.json').then((resposta) => resposta.data);
}

export default apiClient;
