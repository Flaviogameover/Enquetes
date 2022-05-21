import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import api from '../services';

interface IOpcoes{
    id?:number;
    uniq_id: string;
    titulo_opcao: string;
}

interface IForm{
    titulo: string;
    opcoes: IOpcoes[];
    data_inicio: string;
    data_termino: string;
    password: string;
    status?: number;
}

const AddEnquete:React.FC = () => {
    const navigate = useNavigate();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const params = useParams<{ enquete_id:string }>();
    const [form, setForm] = useState<IForm>({
        data_inicio: new Date(2022, 0, 4, 13, 0).toISOString().slice(0, 19),
        data_termino: new Date(2022, 0, 4, 14, 0).toISOString().slice(0, 19),
        opcoes: [
            {
                uniq_id: v4(),
                titulo_opcao: '',
            },
            {
                uniq_id: v4(),
                titulo_opcao: '',
            },
            {
                uniq_id: v4(),
                titulo_opcao: '',
            },
        ],
        titulo: '',
        password: '',
    });

    const handleChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleChangeOption = (event:React.ChangeEvent<HTMLInputElement>, id:string):void => {
        const { name, value } = event.target;
        setForm({
            ...form,
            opcoes:
                form.opcoes.map((opcao:IOpcoes) => {
                    if (opcao.uniq_id === id) {
                        return {
                            ...opcao,
                            [name]: value,
                        };
                    }
                    return opcao;
                }),
        });
    };

    const handleAddOption = ():void => {
        if (form.opcoes.length < 10) {
            setForm({
                ...form,
                opcoes: [
                    ...form.opcoes,
                    {
                        uniq_id: v4(),
                        titulo_opcao: '',
                    },
                ],
            });
        }
    };

    const handleRemoveOption = (id:string):void => {
        setForm({
            ...form,
            opcoes: form.opcoes.filter((opcao:IOpcoes) => opcao.uniq_id !== id),
        });
    };

    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>):Promise<void> => {
        event.preventDefault();
        try {
            let response;
            if (isUpdate) {
                response = await api.put(`/enquetes/${params.enquete_id}`, form);
            } else {
                response = await api.post('/enquetes', form);
            }
            alert(response.data.message);
            navigate('/');
        } catch (err:any) {
            alert(err.response.data.error);
        }
    };

    useEffect(() => {
        if (params.enquete_id) {
            setIsUpdate(true);
            const formatDate = (date:string):string => {
                const [cur_date, cur_time] = date.split(' ');
                const [day, month, year] = cur_date.split('/');
                const [hour, minute] = cur_time.split(':');
                const result = `${year}-${month}-${day}T${hour}:${minute}`;
                return result;
            };

            const fetchData = async ():Promise<void> => {
                try {
                    const response = await api.get<IForm>(`/enquetes/${params.enquete_id}`);
                    setForm({
                        ...response.data,
                        data_inicio: formatDate(response.data.data_inicio),
                        data_termino: formatDate(response.data.data_termino),
                        password: '',
                    });
                } catch (err:any) {
                    if (err.response.status === 404) {
                        navigate('/');
                    }
                }
            };
            fetchData();
        }
    }, [params.enquete_id]);

    return (
        <section className="add-enquete">
            <Link className="btn-voltar" to="/">
                Voltar
            </Link>
            <h1>Adicionar Enquete</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="enquete-title">Título</label>
                    <input required type="text" id="enquete-title" name="titulo" value={form.titulo} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="enquete-start">Data de Início</label>
                    <input required type="datetime-local" id="enquete-start" name="data_inicio" min="2020-06-07T00:00" value={form.data_inicio} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="enquete-end">Data de Término</label>
                    <input required type="datetime-local" id="enquete-end" name="data_termino" value={form.data_termino} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="enquete-pass">Senha</label>
                    <input required type="password" id="enquete-pass" name="password" value={form.password} onChange={handleChange} />
                </div>
                {
                    form.opcoes.map((opcao:IOpcoes, index:number) => (
                        <div className="form-group" key={index}>
                            <label htmlFor={`enquete-option-${index}`}>
                                Opção
                                {' '}
                                {index + 1}
                            </label>
                            <input required type="text" id={`enquete-option-${opcao.uniq_id}`} name="titulo_opcao" value={opcao.titulo_opcao} onChange={(e) => handleChangeOption(e, opcao.uniq_id)} />
                            {
                                form.opcoes.length > 3 && (
                                    <button className="btn-remove" type="button" onClick={() => handleRemoveOption(opcao.uniq_id)}>
                                        Deletar
                                    </button>
                                )
                            }
                        </div>
                    ))
                }
                {
                    form.opcoes.length < 10 && (
                        <div className="form-group">
                            <button type="button" className="btn-option btn" onClick={handleAddOption}>+</button>
                        </div>
                    )
                }
                <button type="submit" className="btn-submit btn">{isUpdate ? 'Atualizar Enquete' : 'Criar Enquete'}</button>
            </form>
        </section>
    );
};

export default AddEnquete;
