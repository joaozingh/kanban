// criar card
function criarCard(colunaId) {
  const texto = prompt("Digite o texto do card:");
  if (!texto) return;

  criarCardComTexto(colunaId, texto);
  salvarEstado();
}

// criar card com texto (usado no load)
function criarCardComTexto(colunaId, texto) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <span class="texto">${texto}</span>
    <div class="acoes">
      <button class="editar">✏</button>
      <button class="excluir">❌</button>
    </div>
  `;

  adicionarEventos(card);
  document.getElementById(colunaId).appendChild(card);
}

// eventos do card
function adicionarEventos(card) {
  const texto = card.querySelector(".texto");
  const btnEditar = card.querySelector(".editar");
  const btnExcluir = card.querySelector(".excluir");

  // editar
  btnEditar.addEventListener("click", () => {
    const novoTexto = prompt("Editar:", texto.textContent);
    if (novoTexto) {
      texto.textContent = novoTexto;
      salvarEstado();
    }
  });

  // excluir
  btnExcluir.addEventListener("click", () => {
    card.remove();
    salvarEstado();
  });
}

// drag moderno (funciona PC + celular)
document.querySelectorAll(".coluna").forEach(coluna => {
  new Sortable(coluna, {
    group: "kanban",
    animation: 150,
    ghostClass: "dragging",
    onEnd: salvarEstado
  });
});

// salvar estado
function salvarEstado() {
  const dados = {};

  document.querySelectorAll(".coluna").forEach(coluna => {
    const id = coluna.id;
    dados[id] = [];

    coluna.querySelectorAll(".card .texto").forEach(card => {
      dados[id].push(card.textContent);
    });
  });

  localStorage.setItem("kanban", JSON.stringify(dados));
}

// carregar estado
function carregarEstado() {
  const dados = JSON.parse(localStorage.getItem("kanban"));
  if (!dados) return;

  for (let colunaId in dados) {
    dados[colunaId].forEach(texto => {
      criarCardComTexto(colunaId, texto);
    });
  }
}

carregarEstado();