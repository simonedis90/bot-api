import { Column, Entity } from "typeorm";
import { BaseEntity } from "./baseEntity";


@Entity()
export class BetEntity extends BaseEntity{

    @Column({type: 'varchar', length: 20})
    eventId: string;

    @Column({type: 'varchar', length: 20})
    marketId: string;

    @Column({type: 'bigint'})
    size: number;

    @Column({type: 'bigint'})
    price: number;

    @Column({type: 'varchar', length: 20})
    selectionId: string;

    @Column({type: 'jsonb'})
    response: BetResponse;

    @Column({type: 'varchar', length: 10})
    outcome: string;

    @Column({type: 'boolean', default: false, nullable: true})
    cashout: boolean;
}


export interface LimitOrder {
    size: number;
    price: number;
    persistenceType: string;
}

export interface Instruction {
    side: string;
    handicap: number;
    orderType: string;
    limitOrder: LimitOrder;
    selectionId: number;
}

export interface InstructionReport {
    betId: string;
    status: string;
    placedDate: Date;
    instruction: Instruction;
    orderStatus: string;
    sizeMatched: number;
    averagePriceMatched: number;
}

export interface BetResponse {
    status: string;
    marketId: string;
    instructionReports: InstructionReport[];
}
