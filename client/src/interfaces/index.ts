export interface IFilter{
    slug: string;
    title: string;
    color: string;
}

export interface IEnquetes{
    data_inicio: string;
    data_termino: string;
    opcoes: IOpcoes[];
    titulo: string;
    uniq_id: string;
    votos_total: number;
    status: number;
}

export interface IOpcoes{
    id?: number;
    id_enquete: number;
    titulo_opcao: string;
    votos_opcao: number;
}
