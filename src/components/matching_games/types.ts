export interface CardProps {
    id: string;
    src: string;
    matched: boolean;
    match_index: number;
    language: string;
    side: string;
}
//id: number,
// side: string

export interface TextCardRefProps {
    set_bgColor: (color: string) => void;
  }

export interface TextCardComponentProps {
    card: CardProps;
    handleChoice: (card: CardProps) => void;    
}
