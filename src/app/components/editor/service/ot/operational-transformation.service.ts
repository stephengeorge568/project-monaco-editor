import { Injectable } from '@angular/core';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { Queue } from 'src/app/objects/Queue';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';
import { MonacoRangeService } from './monaco-range.service';

@Injectable({
providedIn: 'root'
})
/*
    This class is an exact translation of the Operational Transformation functionality in OT-server.
*/
export class OperationalTransformationService {

    revID: number;
    history: Map<number, StringChangeRequest[]>;

    constructor(private monacoService: MonacoRangeService) {
        this.revID = 1;
        this.history = new Map();
    }

    public insertRequestIntoHistory(req: StringChangeRequest): void {
        if (this.history.get(req.revID) == undefined) {
            this.history.set(req.revID, [req]);
        } else this.history.get(req.revID)?.push(req);
    }

    /**
     * Get the historical requests that affect the current request based on its revID
     * oldest changes at head of list, ascending order
     * @param revID the revID of the current request
     * @param history the history map
     * @return list of requests that affect the current request
     */
    private getRelevantHistory(revID: number, history: Map<number, StringChangeRequest[]>): StringChangeRequest[] {
        let relevantRequests: StringChangeRequest[] = [];
        history.forEach((list, id) => {
            if (id >= revID) {
                relevantRequests = [...relevantRequests, ...list];
            }
        });
        return relevantRequests;
    }

    /**
     * Transforms the given request based on the history of committed requests
     * @param request the request to transform
     * @param history the history of committed requests
     * @return
     */
    public transform(request: StringChangeRequest): StringChangeRequest[] {
        let transformedRequests: StringChangeRequest[] = [];

        let toTransformQueue: Queue<[StringChangeRequest, number]> = new Queue();
        toTransformQueue.enqueue([request, -1]);

        let currentRequest: [StringChangeRequest, number] | undefined;
        while((currentRequest = toTransformQueue.dequeue()) != undefined) {
            let relevantHistory: StringChangeRequest[] = this.getRelevantHistory(request.revID, this.history);
            
            for (let i = 0; i < relevantHistory.length; i++) {              
                let historicalRequest: StringChangeRequest = relevantHistory[i];

                if (request.identity !== historicalRequest.identity) {
                    let pair: StringChangeRequest[] = this.monacoService.resolveConflictingRanges(historicalRequest, currentRequest[0]);
                    if (currentRequest[1] < i) {
                        currentRequest[0] = this.transformOperation(historicalRequest, pair[0]);
                    }

                    if (pair[1] != null) {
                        toTransformQueue.enqueue([pair[1], i]);
                    }
                }
            }

            for (var newHistoralRequest of transformedRequests) {
                if (this.monacoService.isPreviousRequestRelevant(newHistoralRequest.range, currentRequest[0].range)) {
                    currentRequest[0] = this.transformOperation(newHistoralRequest, currentRequest[0]);
                }
            }
            
            transformedRequests.push(currentRequest[0]);
        }
        return transformedRequests;
    }
    /**
     * Returns the transformed version of next based on the prev historical request.
     * @param prev the previous request, which serves as the basis on which to transform next
     * @param next the current request to transform
     * @return the transformed version of next that was altered based on prev's range and text
     */
    private transformOperation(prev: StringChangeRequest, next: StringChangeRequest): StringChangeRequest {
        let newSC: number = next.range.startColumn;
        let newEC: number = next.range.endColumn;
        let newSL: number = next.range.startLineNumber;
        let newEL: number = next.range.endLineNumber;
        let numberOfNewLinesInPrev: number = (prev.text.match('\n') || []).length;
        let prevTextLengthAfterLastNewLine: number = prev.text.length;

        if (numberOfNewLinesInPrev > 0) {
            prevTextLengthAfterLastNewLine = prev.text.length - prev.text.lastIndexOf("\n") - 1;
        }

        if (this.monacoService.isPreviousRequestRelevant(prev.range, next.range)) {
            let netNewLineNumberChange: number = numberOfNewLinesInPrev
                    - (prev.range.endLineNumber - prev.range.startLineNumber);

            let isPrevSimpleInsert: boolean = prev.range.startColumn == prev.range.endColumn
                    && prev.range.startLineNumber == prev.range.endLineNumber;

            if (isPrevSimpleInsert) {
                if (numberOfNewLinesInPrev > 0) {
                    if (next.range.startLineNumber == prev.range.endLineNumber) {
                        newSC = newSC - prev.range.endColumn + prevTextLengthAfterLastNewLine + 1;
                    } if (next.range.endLineNumber == prev.range.endLineNumber) {
                        newEC = newEC - prev.range.endColumn + prevTextLengthAfterLastNewLine + 1;
                    }
                } else {
                    if (next.range.startLineNumber == prev.range.endLineNumber) {
                        newSC = newSC + prevTextLengthAfterLastNewLine;
                    } if (next.range.endLineNumber == prev.range.endLineNumber) {
                        newEC = newEC + prevTextLengthAfterLastNewLine;
                    }
                }
            } else {
                if (numberOfNewLinesInPrev > 0) {
                    if (next.range.startLineNumber == prev.range.endLineNumber) {
                        newSC = (newSC - prev.range.endColumn) + prevTextLengthAfterLastNewLine + 1; // do i need +1?
                    }
                    if (next.range.endLineNumber == prev.range.endLineNumber) {
                        newEC = (newEC - prev.range.endColumn) + prevTextLengthAfterLastNewLine + 1;
                    }
                } else {
                    let numberOfCharsDeletedOnPrevLine: number = prev.range.endColumn
                                - prev.range.startColumn;
                    if (next.range.startLineNumber == prev.range.endLineNumber) {
                        newSC = newSC - numberOfCharsDeletedOnPrevLine + prev.text.length;
                    } else {
                        newSC = prev.range.startColumn + prev.text.length;
                    }


                    if (next.range.endLineNumber == prev.range.endLineNumber) {
                        newEC = newEC - numberOfCharsDeletedOnPrevLine + prev.text.length;
                    } else {
                        if (this.monacoService.isRangeSimpleInsert(next.range)) {
                            newEC = newSC;
                        }
                    }
                }
            }

            if (this.monacoService.isSCWithinRange(prev.range, next.range)) {
                newSL = prev.range.startLineNumber + numberOfNewLinesInPrev;
            } else {
                newSL += netNewLineNumberChange;
            }

            if (this.monacoService.isECWithinRange(prev.range, next.range)) {
                newSL = prev.range.startLineNumber + numberOfNewLinesInPrev;
            } else {
                newEL += netNewLineNumberChange;
            }
        }
        next.range = new MonacoRange(newSC, newEC, newSL, newEL);
        return next;
    }
}
