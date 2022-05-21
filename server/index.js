require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { Enquetes, EnqueteOpcoes } = require("./database/enquete");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/enquetes", async (req, res) => {
    const enquetes = await Enquetes.findAll();
    const enquete_opcoes = await EnqueteOpcoes.findAll();
    const enquetes_json = enquetes.map((enquete) => {
        let status = 0;
        if (
            Date.now() < new Date(enquete.data_inicio).getTime() &&
            Date.now() < new Date(enquete.data_termino).getTime()
        ) {
            status = 1;
        } else if (
            Date.now() > new Date(enquete.data_inicio).getTime() &&
            Date.now() < new Date(enquete.data_termino).getTime()
        ) {
            status = 2;
        } else if (Date.now() > new Date(enquete.data_termino).getTime()) {
            status = 3;
        }

        return {
            uniq_id: enquete.uniq_id,
            titulo: enquete.titulo,
            votos_total: enquete.votos_total,
            data_inicio: new Date(enquete.data_inicio)
                .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
                .slice(0, 19)
                .replace("T", " "),
            data_termino: new Date(enquete.data_termino)
                .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
                .slice(0, 19)
                .replace("T", " "),
            status,
            opcoes: enquete_opcoes
                .filter((opcao) => {
                    return opcao.id_enquete === enquete.uniq_id;
                })
                .map((opcao) => {
                    return {
                        id_enquete: opcao.id_enquete,
                        titulo_opcao: opcao.titulo_opcao,
                        votos_opcao: opcao.votos_opcao,
                    };
                }),
        };
    });
    res.json(enquetes_json);
});

app.get("/enquetes/:uniq_id", async (req, res) => {
    const enquete = await Enquetes.findOne({
        where: {
            uniq_id: req.params.uniq_id,
        },
    });
    if (!enquete) {
        return res.status(404).json({
            error: "Enquete não encontrada",
        });
    } else {
        const enquete_opcoes = await EnqueteOpcoes.findAll({
            where: {
                id_enquete: req.params.uniq_id,
            },
        });
        const enquetes_json = {
            uniq_id: enquete.uniq_id,
            titulo: enquete.titulo,
            votos_total: enquete.votos_total,
            data_inicio: new Date(enquete.data_inicio).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
            }),
            data_termino: new Date(enquete.data_termino).toLocaleString(
                "pt-BR",
                { timeZone: "America/Sao_Paulo" }
            ),
            opcoes: enquete_opcoes.map((opcao) => {
                return {
                    id: opcao.id,
                    uniq_id: uuidv4(),
                    id_enquete: opcao.id_enquete,
                    titulo_opcao: opcao.titulo_opcao,
                    votos_opcao: opcao.votos_opcao,
                };
            }),
        };
        res.json(enquetes_json);
    }
});

app.put("/enquetes/:id/vote", async (req, res) => {
    const { enquete, vote } = req.body;

    if (new Date(enquete.data_inicio) > Date.now()) {
        return res.status(400).json({
            error: "Enquete ainda não iniciada",
        });
    } else if (new Date(enquete.data_termino) < Date.now()) {
        return res.status(400).json({
            error: "Enquete já encerrada",
        });
    }

    const enquete_opcao = await EnqueteOpcoes.findOne({
        where: {
            id: vote.id,
            id_enquete: enquete.uniq_id,
        },
    });

    if (!enquete_opcao) {
        return res.status(404).json({
            error: "Opção não encontrada",
        });
    }
    const update_opcao = await EnqueteOpcoes.update(
        {
            votos_opcao: enquete_opcao.votos_opcao + 1,
        },
        {
            where: {
                id: vote.id,
                id_enquete: enquete.uniq_id,
            },
        }
    );

    if (update_opcao[0] === 0) {
        return res.status(404).json({
            error: "Opção não encontrada",
        });
    }

    const update_enquete = await Enquetes.update(
        {
            votos_total: enquete.votos_total + 1,
        },
        {
            where: {
                uniq_id: enquete.uniq_id,
            },
        }
    );

    if (update_enquete[0] === 0) {
        return res.status(404).json({
            error: "Enquete não encontrada",
        });
    }

    res.status(200).json({
        message: "Voto computado com sucesso",
    });
});

app.post("/enquetes", async (req, res) => {
    const { titulo, data_inicio, data_termino, opcoes, password } = req.body;
    let success = true;

    if (
        !titulo ||
        !data_inicio ||
        !data_termino ||
        !opcoes ||
        !password ||
        new Date(data_inicio) > new Date(data_termino) ||
        opcoes.length < 3 ||
        opcoes.length > 10
    ) {
        success = false;
        res.status(400).json({
            error: "Ocorreu um erro ao criar a enquete, verifique os dados ou recarregue a página.",
        });
        return;
    }

    const data = {
        uniq_id: uuidv4(),
        titulo,
        votos_total: 0,
        data_inicio,
        data_termino,
        password: bcrypt.hashSync(password, 10),
    };

    if (success) {
        const enquete = await Enquetes.create(data);

        const opcoes_data = opcoes.map((opcao) => {
            return {
                id_enquete: enquete.uniq_id,
                titulo_opcao: opcao.titulo_opcao,
                votos_opcao: 0,
            };
        });

        await EnqueteOpcoes.bulkCreate(opcoes_data);

        res.status(201).json({
            success: true,
            message: "Enquete criada com sucesso!",
        });
    }
});

app.put("/enquetes/:id", async (req, res) => {
    const { uniq_id, titulo, data_inicio, data_termino, opcoes, password } =
        req.body;
    let success = true;

    if (
        !uniq_id ||
        !titulo ||
        !data_inicio ||
        !data_termino ||
        !opcoes ||
        !password ||
        new Date(data_inicio) > new Date(data_termino) ||
        opcoes.length < 3 ||
        opcoes.length > 10
    ) {
        success = false;
        return res.status(400).json({
            error: "Ocorreu um erro ao atualizar a enquete, verifique os dados ou recarregue a página.",
        });
    }

    const enquete = await Enquetes.findOne({
        where: {
            uniq_id,
        },
    });

    if (!enquete) {
        success = false;
        return res.status(404).json({
            error: "Enquete não encontrada",
        });
    }

    else if(!bcrypt.compareSync(password, enquete.password)){
        success = false;
        return res.status(400).json({
            error: "Senha incorreta",
        });
    }

    const data = {
        titulo,
        data_inicio,
        data_termino,
    };

    if (success) {
        await Enquetes.update(data, {
            where: {
                uniq_id,
            },
        });
        const opcoes_data = opcoes.map((opcao) => {
            return {
                id_enquete: uniq_id,
                titulo_opcao: opcao.titulo_opcao,
                votos_opcao: opcao.votos_opcao,
            };
        });

        await EnqueteOpcoes.destroy({
            where: {
                id_enquete: uniq_id,
            },
        });

        await EnqueteOpcoes.bulkCreate(opcoes_data);

        /* get votos */
        const votos = await EnqueteOpcoes.findAll({
            where: {
                id_enquete: uniq_id,
            },
        });

        const votos_total = votos.reduce((acc, opcao) => {
            return acc + opcao.votos_opcao;
        }, 0);

        await Enquetes.update(
            {
                votos_total,
            },
            {
                where: {
                    uniq_id,
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Enquete atualizada com sucesso!",
        });
    }
});

app.delete("/enquetes/:id", async (req, res) => {
    const { id } = req.params;
    const { pass } = req.body;

    const enquete = await Enquetes.findOne({
        where: {
            uniq_id: id,
        },
    });

    if (bcrypt.compareSync(pass, enquete.password)) {
        await Enquetes.destroy({
            where: {
                uniq_id: id,
            },
        });

        await EnqueteOpcoes.destroy({
            where: {
                id_enquete: id,
            },
        });

        return res.send({
            message: "Enquete deletada com sucesso",
        });
    } else {
        return res.status(400).send({
            message: "Senha incorreta",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
