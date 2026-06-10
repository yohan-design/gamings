// Banco de ícones oficiais definidos por você
const iconesOriginais = {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6"
};

function obterUsuarioLogado() {
    return localStorage.getItem("usuarioLogado") || "Visitante";
}

// ========================
// REFRESH DE TRAVAS E PROGRESSO
// ========================
function atualizarXP() {
    const xpTexto = document.getElementById("xp");
    const nivelTexto = document.getElementById("nivel");
    const barra = document.getElementById("progresso-xp");
    const usuarioPainel = document.getElementById("usuarioLogado");

    const usuarioAtual = obterUsuarioLogado();
    if (usuarioPainel) {
        usuarioPainel.innerHTML = "Aluno: " + usuarioAtual;
    }

    // Garante que novos usuários comecem rigorosamente com 0 XP
    let xp = localStorage.getItem("xp_" + usuarioAtual);
    if (xp === null) {
        xp = 0;
        localStorage.setItem("xp_" + usuarioAtual, 0);
    } else {
        xp = Number(xp);
    }

    let visitados = JSON.parse(localStorage.getItem("visitados_" + usuarioAtual)) || [];

    // Cálculo exato de nível: 100 XP por nível (0 XP = Nível 1, 100 XP = Nível 2...)
    let nivel = Math.floor(xp / 100) + 1;

    if (xpTexto && nivelTexto && barra) {
        xpTexto.innerHTML = "XP: " + xp;
        nivelTexto.innerHTML = "Nível: " + nivel;
        // Mostra o progresso atual até a próxima meta de 100
        barra.style.width = (xp % 100) + "%";
    }

    // Varre e atualiza o estado dos cards estáticos do HTML (se existirem na página)
    const todosOsCards = document.querySelectorAll(".card");
    todosOsCards.forEach(card => {
        const id = card.getAttribute("data-id");
        const xpReq = Number(card.getAttribute("data-req"));
        const tag = card.querySelector(".status-tag");
        const icone = card.querySelector(".icone-box");

        card.className = "card"; // Reseta classes anteriores

        if (xp < xpReq) {
            // Se o jogador não tem nível suficiente ainda: Travado
            card.classList.add("bloqueado");
            if (tag) tag.innerHTML = `🔒 Nível ${Math.floor(xpReq / 100) + 1}`;
            if (icone) icone.innerHTML = "🔒";
        } else {
            // Destravado
            if (icone) icone.innerHTML = iconesOriginais[id] || "🎮";
            
            if (visitados.includes(id)) {
                card.classList.add("concluido");
                if (tag) tag.innerHTML = "✓ Concluído";
            } else {
                card.classList.add("disponivel");
                if (tag) tag.innerHTML = "➔ Jogar";
            }
        }
    });
}

// ========================
// CONTROLE DE CLIQUE NOS JOGOS
// ========================
function clicarProjeto(elemento) {
    if (elemento.classList.contains("bloqueado")) {
        alert("Acesse e complete os projetos anteriores para liberar este nível!");
        return;
    }

    const usuarioAtual = obterUsuarioLogado();
    const id = elemento.getAttribute("data-id");
    const url = elemento.getAttribute("data-url");

    let visitados = JSON.parse(localStorage.getItem("visitados_" + usuarioAtual)) || [];
    let xp = Number(localStorage.getItem("xp_" + usuarioAtual)) || 0;

    // Só ganha os 100 XP se for a PRIMEIRA vez jogando este projeto específico
    if (!visitados.includes(id)) {
        visitados.push(id);
        localStorage.setItem("visitados_" + usuarioAtual, JSON.stringify(visitados));

        xp += 100;
        localStorage.setItem("xp_" + usuarioAtual, xp);

        alert("+100 XP! Você subiu de nível e liberou o próximo projeto!");
    }

    atualizarXP();
    window.open(url, "_blank");
}

// ========================
// REFORMULAÇÃO DO CADASTRO (MELHORADO)
// ========================
function cadastrar() {
    const usuario = document.getElementById("novoUsuario").value.trim();
    const senha = document.getElementById("novaSenha").value;

    if (!usuario || !senha) {
        alert("Preencha todos os campos para se cadastrar.");
        return;
    }
    
    if (localStorage.getItem("usuario_" + usuario)) {
        alert("Este nome de usuário já está sendo usado!");
        return;
    }

    // Salva as credenciais
    localStorage.setItem("usuario_" + usuario, senha);
    
    // Configura a conta do aluno zerada (Rigorosamente 0 XP)
    localStorage.setItem("xp_" + usuario, 0);
    localStorage.setItem("visitados_" + usuario, JSON.stringify([]));

    // LOGA AUTOMATICAMENTE (Melhoria de usabilidade)
    localStorage.setItem("usuarioLogado", usuario);

    alert("Conta criada com sucesso! Entrando no portal...");
    window.location.href = "index.html"; // Vai direto para os jogos
}

// ========================
// LOGIN TRADICIONAL
// ========================
function entrar() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const senhaSalva = localStorage.getItem("usuario_" + usuario);

    if (senha === senhaSalva && senhaSalva !== null) {
        localStorage.setItem("usuarioLogado", usuario);
        window.location.href = "index.html";
    } else {
        alert("Usuário ou senha incorretos.");
    }
}

// Inicializa a interface dependendo de qual página está aberta
window.onload = function() {
    atualizarXP();
};