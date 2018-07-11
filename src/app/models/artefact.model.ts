import { ArtefactData } from './artefact-data.model';
export class Artefact {
    id: string;
    name: string;
    data: ArtefactData[];
    issuer: string;
    owner: string;
    file: string;
    requests: ['']; // default empty value
    authorized: ['']; // default empty value
}
