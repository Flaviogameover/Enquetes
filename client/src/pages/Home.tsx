import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IFilter, IEnquetes } from '../interfaces';
import TableEnquetes from '../components/TableEnquetes';
import ModalDelete from '../components/ModalDelete';
import api from '../services';

const Home:React.FC = () => {
    const filters:IFilter[] = [
        {
            slug: '/',
            title: 'Todas',
            color: '#0fc0c0',
        },
        {
            slug: '/nao-iniciadas',
            title: 'Não iniciadas',
            color: '#fe9e9e',
        },
        {
            slug: '/em-andamento',
            title: 'Em andamento',
            color: '#fa8c16',
        },
        {
            slug: '/finalizadas',
            title: 'Finalizadas',
            color: '#00c853',
        },
    ];

    const params = useParams<{ filter: string }>();
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [enquetes, setEnquetes] = useState<IEnquetes[]>([]);
    const [idTarget, setIdTarget] = useState<string>('');
    const [error, setError] = useState<string>('');

    const loadEnquetes:()=>void = async ():Promise<void> => {
        const filter:string = params.filter || '/';
        const { data } = await api.get<IEnquetes[]>('/enquetes');
        let enquetes_filtradas:IEnquetes[] = [];
        if (filter === 'nao-iniciadas') {
            enquetes_filtradas = data.filter((enquete:IEnquetes) => enquete.status === 1);
        } else if (filter === 'em-andamento') {
            enquetes_filtradas = data.filter((enquete:IEnquetes) => enquete.status === 2);
        } else if (filter === 'finalizadas') {
            enquetes_filtradas = data.filter((enquete:IEnquetes) => enquete.status === 3);
        } else {
            enquetes_filtradas = data;
        }
        setEnquetes(enquetes_filtradas);
    };

    const handleDelete = (pass:string):void => {
        deleteEnquete(pass);
    };

    const deleteEnquete:(pass:string)=>void = async (pass:string):Promise<void> => {
        try {
            const response = await api.delete(`/enquetes/${idTarget}`, { data: { pass } });
            if (response.status === 200) {
                handleModalDelete();
                setError('');
                loadEnquetes();
            }
        } catch (err:any) {
            setError(err.response.data.message);
        }
    };

    const handleModalDelete = ():void => {
        setModalDelete(!modalDelete);
    };
    useEffect(() => {
        loadEnquetes();
    }, [params]);

    return (
        <section className="home">
            {
                modalDelete && (
                    <ModalDelete error={error} handleDelete={handleDelete} handleModalDelete={handleModalDelete} />
                )
            }
            <h1>Participe de nossas enquetes!</h1>

            <div className="home-top">
                <div className="home-filters">
                    {
                        filters.map((filter:IFilter) => (
                            <div key={filter.slug} className="home-filters-item">
                                <Link style={{ background: filter.color }} to={`${filter.slug}`}>{filter.title}</Link>
                            </div>
                        ))
                    }
                </div>
                <div className="home-add">
                    <Link to="/add">+</Link>
                </div>
            </div>
            <TableEnquetes enquetes={enquetes} setIdTarget={setIdTarget} handleModalDelete={handleModalDelete} />
        </section>
    );
};

export default Home;
