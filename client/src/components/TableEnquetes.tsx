import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { IEnquetes } from '../interfaces';

interface Props{
    enquetes: IEnquetes[];
    handleModalDelete: () => void;
    setIdTarget:(id:string)=>void;
}

const TableEnquetes:React.FC<Props> = ({ enquetes, handleModalDelete, setIdTarget }) => {
    const handleDelete = (id:string):void => {
        setIdTarget(id);
        handleModalDelete();
    };

    return (
        <div className="table-enquetes">
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Data de início</th>
                        <th>Data de término</th>
                        <th>Votos</th>
                        <th>Editar</th>
                        <th>Deletar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        enquetes?.map((enquete:IEnquetes) => (
                            <tr key={enquete.uniq_id}>
                                <td className="table-link-title"><Link to={`/enquete/${enquete.uniq_id}`}>{enquete.titulo}</Link></td>
                                <td>
                                    &#128467;
                                    {enquete.data_inicio}

                                </td>
                                <td>
                                    &#128467;
                                    {enquete.data_termino}

                                </td>
                                <td>{enquete.votos_total}</td>
                                <td className="table-icon">
                                    <Link to={`/edit/${enquete.uniq_id}`}>
                                        &#128221;
                                    </Link>

                                </td>
                                <td className="table-icon"><button type="button" onClick={() => handleDelete(enquete.uniq_id)}>X</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default TableEnquetes;
