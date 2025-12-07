function logar() {
    let login = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    /* Se login e senha estão vazios */
    if (login == "" || senha == "") {
        alert("Preencha todos os campos. ");
    } else {
        /* Valida login e senha do Usuário: */
        if (
            login == "123" &&
            (senha == "123")
        ) {
            /* Sucesso, redireciona para pag orcamentos.html */
            alert("Sucesso, Login bem-sucedido. ");
            location.href = "orcamentos.html";
        } else {
            /* Erro, não foi validado o login */
            alert("Usuário ou senha incorretos. ");
        }
    }
}