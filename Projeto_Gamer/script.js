// Menu responsivo compartilhado por todas as páginas
const botaoMenu = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
if (botaoMenu && menu) {
  botaoMenu.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    botaoMenu.textContent = aberto ? '×' : '☰';
  });
}

// Busca e filtros interativos do catálogo
const pesquisa = document.querySelector('#pesquisa');
const filtroGenero = document.querySelector('#filtro-genero');
const filtroEstado = document.querySelector('#filtro-estado');
const tabela = document.querySelector('#tabela-jogos');
if (tabela && pesquisa && filtroGenero && filtroEstado) {
  const linhas = [...tabela.querySelectorAll('tbody tr')];
  const contagem = document.querySelector('#resultado-contagem');
  const mensagemVazia = document.querySelector('#mensagem-vazia');

  function filtrarJogos() {
    const termo = pesquisa.value.trim().toLocaleLowerCase('pt-BR');
    const genero = filtroGenero.value;
    const estado = filtroEstado.value;
    let visiveis = 0;
    linhas.forEach(linha => {
      const combinaNome = linha.dataset.nome.includes(termo);
      const combinaGenero = genero === 'todos' || linha.dataset.genero === genero;
      const combinaEstado = estado === 'todos' || linha.dataset.estado === estado;
      const mostrar = combinaNome && combinaGenero && combinaEstado;
      linha.hidden = !mostrar;
      if (mostrar) visiveis++;
    });
    contagem.textContent = `${visiveis} ${visiveis === 1 ? 'jogo encontrado' : 'jogos encontrados'}.`;
    mensagemVazia.hidden = visiveis !== 0;
  }
  pesquisa.addEventListener('input', filtrarJogos);
  filtroGenero.addEventListener('change', filtrarJogos);
  filtroEstado.addEventListener('change', filtrarJogos);

  // Permite abrir o catálogo já filtrado por links da página inicial
  const categoriaLink = new URLSearchParams(window.location.search).get('categoria');
  const categorias = { Acao: 'Ação', Esportes: 'Esportes', RPG: 'RPG' };
  if (categoriaLink && categorias[categoriaLink]) filtroGenero.value = categorias[categoriaLink];
  filtrarJogos();

  // Janela de detalhes acessível, fechada pelo botão, clique no fundo ou Escape
  const modal = document.querySelector('#modal-detalhes');
  const modalTexto = document.querySelector('#modal-texto');
  const fechar = document.querySelector('.modal-fechar');
  const ok = document.querySelector('#modal-ok');
  let ultimoBotao = null;
  function fecharModal() {
    modal.hidden = true;
    if (ultimoBotao) ultimoBotao.focus();
  }
  document.querySelectorAll('.detalhe-btn').forEach(botao => {
    botao.addEventListener('click', () => {
      ultimoBotao = botao;
      modalTexto.textContent = botao.dataset.detalhe;
      modal.hidden = false;
      fechar.focus();
    });
  });
  fechar.addEventListener('click', fecharModal);
  ok.addEventListener('click', fecharModal);
  modal.addEventListener('click', evento => { if (evento.target === modal) fecharModal(); });
  document.addEventListener('keydown', evento => { if (evento.key === 'Escape' && !modal.hidden) fecharModal(); });
}

// Formulário de demonstração: valida campos e confirma sem enviar dados a terceiros
const formulario = document.querySelector('#form-contato');
if (formulario) {
  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    const retorno = document.querySelector('#retorno-form');
    if (!formulario.reportValidity()) return;
    const nome = document.querySelector('#nome').value.trim();
    retorno.classList.remove('erro');
    retorno.textContent = `Obrigado, ${nome}! Sua mensagem foi validada neste navegador. Como este é um projeto demonstrativo, ela não foi enviada a um servidor.`;
    formulario.reset();
    retorno.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
