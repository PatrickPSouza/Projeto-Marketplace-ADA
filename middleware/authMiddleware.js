let logado = false;

const authMiddleware = (req, res, next) => {
    
    console.log("entrou no middleware");
    // Verifica se o usuário está autenticado
    if (!req.session || !req.session.sucesso) {
        console.log('Usuário não autenticado. Redirecionando para a página inicial');
        console.log(req.session);
        return res.redirect('/'); // Redireciona para a página de login se não estiver autenticado
    } else {
        // Se o usuário estiver autenticado, continue para a próxima rota
        console.log('Usuário autenticado. Continuando para a próxima rota');
        console.log(req.session);
        if (logado === false) {
            logado = true;
            res.render('indexs/indexlogado');
        } else {
            next();
        }
    }
};

module.exports = authMiddleware;
