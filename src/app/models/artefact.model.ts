import { ArtefactData } from './artefact-data.model';
export class Artefact {
    id: string;
    name: string;
    data: ArtefactData[];
    requests: ['']; // default empty value
    owner: string;
    authorized: [''];
}
