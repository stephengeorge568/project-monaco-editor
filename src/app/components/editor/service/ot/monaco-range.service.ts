import { Injectable } from '@angular/core';
import { MonacoRange } from 'src/app/objects/MonacoRange';
import { StringChangeRequest } from 'src/app/objects/StringChangeRequest';

@Injectable({
    providedIn: 'root'
})
export class MonacoRangeService {

    constructor() { }

    /**
     * Determines whether or not a historical request affects the current request.
     * @param prev previous, historical request
     * @param next current request
     * @return true when prev range is at same spot or before next range
     * - i.e prev will affect next's range when transformed, false otherwise
     */
    public isPreviousRequestRelevant(prev: MonacoRange, next: MonacoRange): boolean {
        let isNextSimpleInsert: boolean = next.startLineNumber - next.endLineNumber == 0 && 
                                            next.startColumn - next.endColumn == 0;
        let isPrevStartLineAfterNextEndLine: boolean = prev.startLineNumber > next.endLineNumber;
        let isSameLine: boolean = prev.startLineNumber == next.endLineNumber

        if (isPrevStartLineAfterNextEndLine) return false; // if prev is on bigger line # than next - ignore
        if (isSameLine) { 
            // if prev starts on same line that next ends
            // if next is simple insert, then next.ec cannot be prev.sc
            if(isNextSimpleInsert) {
                // next.ec must be less than prev.sc
                if (next.endColumn < prev.startColumn) return false;
            } else {
                // next.ec must be less or equal
                if (next.endColumn <= prev.startColumn) return false;
            }
        }
        return true;
    }

    public isRangeOverlap(prev: MonacoRange, next: MonacoRange): boolean {
        return this.isSCWithinRange(next, prev) || this.isSCWithinRange(prev, next)
                    || this.isECWithinRange(next, prev) || this.isECWithinRange(prev, next);
    }

    /**
     * Determines whether or not p's start column is within n's range
     * @param n request n
     * @param p request p
     * @return true when p's start column is within n's range. false otherwise
     */
    public isSCWithinRange(prev: MonacoRange, next: MonacoRange): boolean {
        if (next.startLineNumber > prev.startLineNumber
                    && next.startLineNumber < prev.endLineNumber) return true;

        if (next.startLineNumber == prev.startLineNumber) {
            if (next.startLineNumber == prev.endLineNumber) {
                if (!(next.startColumn < prev.endColumn)) return false;
            } if (next.startColumn >= prev.startColumn) return true;
        }

        if (next.startLineNumber == prev.endLineNumber && next.startLineNumber != prev.startLineNumber) {
            if (next.startColumn < prev.endColumn) return true;
        }

        return false;
    }

    /**
     * Determines whether or not n's end column is within p's range   -note comment changed here. used to be other way around
     * @param n request n
     * @param p request p
     * @return true when n's end column is within p's range. false otherwise
     */
    public isECWithinRange(prev: MonacoRange, next: MonacoRange): boolean {
        if (next.endLineNumber < prev.endLineNumber
                    && next.endLineNumber > prev.startLineNumber) return true;

        if (next.endLineNumber == prev.endLineNumber) {
            if (next.endLineNumber == prev.startLineNumber) {
                if (!(next.endColumn > prev.startColumn)) return false;
            } if (next.endColumn <= prev.endColumn) return true;
        }

        if (next.endLineNumber == prev.startLineNumber && next.endLineNumber != prev.endLineNumber) {
            if (next.endColumn > prev.startColumn) return true;
        }

        return false;
    }

    /**
     * Shifts the range of next to remove selection that both prev and next delete/replace
     * @param prev previous, historical request
     * @param next current request that can be altered
     * @return List of at most 2 requests. The first element is the original request that may have be altered.
     * the second element is either null or a second request generated from splitting two ranges
     */
    public resolveConflictingRanges(prev: StringChangeRequest, next: StringChangeRequest): StringChangeRequest[] {

        if (this.isRangeSimpleInsert(prev.range)  || this.isRangeSimpleInsert(next.range)) {
            return new Array<StringChangeRequest>(next);
        }

        if (this.isSCWithinRange(prev.range, next.range) &&
                    this.isECWithinRange(prev.range, next.range)) {
            next.range.startLineNumber = prev.range.endLineNumber;
            next.range.endLineNumber = prev.range.endLineNumber;
            next.range.startColumn = prev.range.endColumn;
            next.range.endColumn = prev.range.endColumn;
        }

        else if (this.isSCWithinRange(prev.range, next.range)) {
            next.range.startLineNumber = prev.range.endLineNumber;
            next.range.startColumn = prev.range.endColumn;
        }

        else if (this.isECWithinRange(prev.range, next.range)) {
            next.range.endLineNumber = prev.range.startLineNumber;
            next.range.endColumn = prev.range.startColumn;
        }

        else if (this.isECWithinRange(prev.range, next.range)
                && this.isSCWithinRange(prev.range, next.range)) {
            let otherNext: StringChangeRequest = new StringChangeRequest(
                next.timestamp,
                next.text,
                next.identity,
                new MonacoRange(next.range.endColumn, next.range.startColumn, next.range.endLineNumber, next.range.startLineNumber),
                next.revID,
                next.documentId,
                next.setID,
                next.password);
                
            otherNext.text = "";

            //shift end of next to start of prev
            next.range.endColumn = prev.range.startColumn;
            next.range.endLineNumber = prev.range.startLineNumber;

            //shift start of otherNext to end of prev
            otherNext.range.startColumn = prev.range.endColumn;
            otherNext.range.startLineNumber = prev.range.endLineNumber;
            return new Array<StringChangeRequest>(next, otherNext);
        }
        return new Array<StringChangeRequest>(next);
    }

    public isRangeSimpleInsert(range: MonacoRange): boolean {
        return range.startLineNumber - range.endLineNumber == 0
                && range.startColumn - range.endColumn == 0;
    }
}
