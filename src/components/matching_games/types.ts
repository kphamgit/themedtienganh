export interface CardProps {
    
    src: string;
    matched: boolean;
    match_index: number;
    language: string;
    side: string;
}
//id: number,
// side: string

export interface TextCardRefProps {
    //toggleDisabled: () => void;
    set_clicked: (value: boolean) => void;
    set_bgColor: (color: string) => void;
    getText: () => string;
    getSide: () => string;
  }

export interface TextCardComponentProps {
    card: CardProps;
    handleChoice: (card: CardProps) => void;    
}
