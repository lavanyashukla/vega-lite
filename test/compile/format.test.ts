import {vgField} from '../../src/channeldef';
import {formatSignalRef, numberFormat, timeFormatExpression} from '../../src/compile/format';
import {defaultConfig} from '../../src/config';
import {TimeUnit} from '../../src/timeunit';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../../src/type';

describe('Format', () => {
  describe('timeFormatExpression()', () => {
    it('should get the right time expression for month', () => {
      const fieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.MONTH,
        undefined,
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(
        'timeFormat(datum["month_a"], timeUnitSpecifier(["month"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should get the right time expression for yearmonth with custom format', () => {
      const fieldDef = {timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.MONTH,
        '%Y',
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(`timeFormat(datum["yearmonth_a"], '%Y')`);
    });

    it('should get the right time expression for quarter', () => {
      const fieldDef = {timeUnit: TimeUnit.QUARTER, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.QUARTER,
        undefined,
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(
        'timeFormat(datum["quarter_a"], timeUnitSpecifier(["quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should get the right time expression for yearquarter', () => {
      const expression = timeFormatExpression(
        'datum["data"]',
        TimeUnit.YEARQUARTER,
        undefined,
        defaultConfig.timeFormat,
        false
      );
      expect(expression).toBe(
        'timeFormat(datum["data"], timeUnitSpecifier(["year","quarter"], {"year-month":"%b %Y ","year-month-date":"%b %d, %Y "}))'
      );
    });

    it('should get the right time expression for yearmonth with custom format and utc scale type', () => {
      const fieldDef = {timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL};
      const expression = timeFormatExpression(
        vgField(fieldDef, {expr: 'datum'}),
        TimeUnit.MONTH,
        '%Y',
        defaultConfig.timeFormat,
        true
      );
      expect(expression).toBe(`utcFormat(datum["yearmonth_a"], '%Y')`);
    });
  });

  describe('numberFormat()', () => {
    it('should use number format for quantitative scale', () => {
      expect(numberFormat({field: 'a', type: QUANTITATIVE}, undefined, {numberFormat: 'd'})).toBe('d');
    });

    it('should use number format for ordinal and nominal data but don not use config', () => {
      for (const type of [ORDINAL, NOMINAL]) {
        expect(numberFormat({field: 'a', type: type}, undefined, {numberFormat: 'd'})).toBeUndefined();
        expect(numberFormat({field: 'a', type: type}, 'd', {numberFormat: 'd'})).toBe('d');
      }
    });

    it('should support empty number format', () => {
      expect(numberFormat({field: 'a', type: QUANTITATIVE}, undefined, {numberFormat: ''})).toBe('');
    });

    it('should use format if provided', () => {
      expect(numberFormat({field: 'a', type: QUANTITATIVE}, 'a', {})).toBe('a');
    });

    it('should not use number format for binned quantitative scale', () => {
      expect(numberFormat({bin: true, field: 'a', type: QUANTITATIVE}, undefined, {})).toBeUndefined();
    });

    it('should not use number format for temporal scale', () => {
      expect(numberFormat({bin: true, field: 'a', type: TEMPORAL}, undefined, {})).toBeUndefined();
      expect(numberFormat({bin: true, field: 'a', type: ORDINAL, timeUnit: 'month'}, undefined, {})).toBeUndefined();
    });
  });

  describe('formatSignalRef()', () => {
    it('should format ordinal field defs if format is present', () => {
      expect(
        formatSignalRef({
          fieldDef: {field: 'foo', type: 'ordinal'},
          format: '.2f',
          formatType: undefined,
          expr: 'parent',
          config: {}
        })
      ).toEqual({
        signal: 'format(parent["foo"], ".2f")'
      });
    });
  });
});