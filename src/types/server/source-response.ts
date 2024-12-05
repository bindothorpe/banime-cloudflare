import {Response} from './response';

export interface SourceResponse extends Response {
    data: SourceData;
}

export interface SourceData {
    tracks: Track[];
    intro: Intro;
    outro: Outro;
    sources: Source[];
    anilistID: number;
    malID: number;
}

export interface Track {
    file: string;
    label: string;
    kind: string;
    default?: boolean;
}

export interface Intro {
    start: number;
    end: number;
}

export interface Outro {
    start: number;
    end: number;
}

export interface Source {
    url: string;
    type: string;
}

