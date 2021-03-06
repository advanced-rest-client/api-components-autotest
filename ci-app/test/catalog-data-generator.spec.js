const { CatalogDataGenerator } = require('../builds/catalog-data-generator.js');
const { assert } = require('chai');
const path = require('path');
const sinon = require('sinon');

describe('CatalogDataGenerator class', () => {
  describe('Constructor', () => {
    let wd;
    let cmp;
    let org;
    let tv;

    beforeEach(() => {
      wd = path.join(__dirname, '..');
      org = 'advanced-rest-client';
      cmp = 'test-cmp';
      tv = '1.0.0';
    });

    it('Sets component property', () => {
      const instance = new CatalogDataGenerator(wd, org, cmp, tv);
      assert.equal(instance.component, cmp);
    });

    it('Sets version property', () => {
      const instance = new CatalogDataGenerator(wd, org, cmp, tv);
      assert.equal(instance.version, tv);
    });

    it('Sets workingDir property', () => {
      const instance = new CatalogDataGenerator(wd, org, cmp, tv);
      assert.equal(instance.workingDir, wd);
    });

    it('Sets urlResolver property', () => {
      const instance = new CatalogDataGenerator(wd, org, cmp, tv);
      assert.typeOf(instance.urlResolver, 'object');
    });

    it('Sets analyzer property', () => {
      const instance = new CatalogDataGenerator(wd, org, cmp, tv);
      assert.typeOf(instance.analyzer, 'object');
    });
  });

  describe('isComponent()', () => {
    let instance;

    beforeEach(() => {
      const wd = path.join(__dirname, 'test-component-esm');
      const cmp = 'test-component';
      const tv = '1.0.0';
      const org = 'advanced-rest-client';
      instance = new CatalogDataGenerator(wd, org, cmp, tv);
    });

    it('returns true when has polymer.json', async () => {
      const result = await instance.isComponent();
      assert.isTrue(result);
    });
  });

  describe('_extractComponentTags()', () => {
    let instance;
    let analysis;

    beforeEach(async () => {
      const wd = path.join(__dirname, 'test-component-esm');
      const cmp = 'test-component';
      const tv = '1.0.0';
      const org = 'advanced-rest-client';
      instance = new CatalogDataGenerator(wd, org, cmp, tv);
      analysis = await instance.analyzer.analyzePackage();
    });

    it('returns tags array', () => {
      const result = instance._extractComponentTags(analysis);
      assert.typeOf(result, 'array');
      assert.lengthOf(result, 5);
    });
  });

  describe('_getGroupName()', () => {
    let instance;

    beforeEach(() => {
      const wd = path.join(__dirname, 'test-component-esm');
      const cmp = 'test-component';
      const tv = '1.0.0';
      const org = 'advanced-rest-client';
      instance = new CatalogDataGenerator(wd, org, cmp, tv);
    });

    it('Returns default value when no tags', () => {
      const result = instance._getGroupName();
      assert.equal(result, 'ApiElements');
    });

    it('Returns default value when group name', () => {
      const tags = [{ title: 'demo', description: 'test' }];
      const result = instance._getGroupName(tags);
      assert.equal(result, 'ApiElements');
    });

    it('Returns value for group', () => {
      const tags = [{ title: 'group', description: 'test' }];
      const result = instance._getGroupName(tags);
      assert.equal(result, 'test');
    });

    it('Returns value for memberof', () => {
      const tags = [{ title: 'memberof', description: 'test' }];
      const result = instance._getGroupName(tags);
      assert.equal(result, 'test');
    });
  });

  describe('_cleanStoreData()', () => {
    let instance;

    beforeEach(() => {
      const wd = path.join(__dirname, 'test-component-esm');
      const cmp = 'test-component';
      const tv = '1.0.0';
      const org = 'advanced-rest-client';
      instance = new CatalogDataGenerator(wd, org, cmp, tv);
    });

    it('Returns the same object', () => {
      const arg = {};
      const result = instance._cleanStoreData(arg);
      assert.isTrue(result === arg);
    });

    it('Calls _cleanItem() on elements array items', () => {
      const spy = sinon.spy(instance, '_cleanItem');
      instance._cleanStoreData({
        elements: [{ id: 1 }, { id: 2 }]
      });
      assert.equal(spy.callCount, 2);
      assert.equal(spy.args[0][0].id, 1);
      assert.equal(spy.args[1][0].id, 2);
    });

    it('Calls _cleanItem() on behaviors', () => {
      const spy = sinon.spy(instance, '_cleanItem');
      instance._cleanStoreData({
        metadata: {
          polymer: {
            behaviors: [{ id: 2 }, { id: 1 }]
          }
        }
      });
      assert.equal(spy.callCount, 2);
      assert.equal(spy.args[0][0].id, 2);
      assert.equal(spy.args[1][0].id, 1);
    });
  });

  describe('_cleanItem()', () => {
    let instance;

    beforeEach(() => {
      const wd = path.join(__dirname, 'test-component-esm');
      const cmp = 'test-component';
      const tv = '1.0.0';
      const org = 'advanced-rest-client';
      instance = new CatalogDataGenerator(wd, org, cmp, tv);
    });

    it('Returns the same object', () => {
      const arg = {};
      const result = instance._cleanItem(arg);
      assert.isTrue(result === arg);
    });

    it('Calls cleanArray() for "events"', () => {
      const spy = sinon.spy(instance, 'cleanArray');
      instance._cleanItem({
        events: [{ id: 1 }, { id: 2 }]
      });
      assert.isTrue(spy.called);
    });

    it('Calls cleanArray() for "events"', () => {
      const spy = sinon.spy(instance, 'cleanArray');
      const events = [{ id: 1 }, { id: 2 }];
      instance._cleanItem({
        events
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][0], events);
    });

    it('Calls cleanArray() for "methods"', () => {
      const spy = sinon.spy(instance, 'cleanArray');
      const methods = [{ id: 1 }, { id: 2 }];
      instance._cleanItem({
        methods
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[1][0], methods);
    });

    it('Calls cleanArray() for "properties"', () => {
      const spy = sinon.spy(instance, 'cleanArray');
      const properties = [{ id: 1 }, { id: 2 }];
      instance._cleanItem({
        properties
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[2][0], properties);
    });

    it('Calls cleanArray() for "slots"', () => {
      const spy = sinon.spy(instance, 'cleanArray');
      const slots = [{ id: 1 }, { id: 2 }];
      instance._cleanItem({
        slots
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[3][0], slots);
    });

    it('Calls cleanArray() for "cssVariables"', () => {
      const spy = sinon.spy(instance, 'cleanArray');
      const cssVariables = [{ id: 1 }, { id: 2 }];
      instance._cleanItem({
        styling: { cssVariables }
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[4][0], cssVariables);
    });

    it('Calls cleanArray() for "selectors"', () => {
      const spy = sinon.spy(instance, 'cleanArray');
      const selectors = [{ id: 1 }, { id: 2 }];
      instance._cleanItem({
        styling: { selectors }
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[5][0], selectors);
    });

    it('Calls cleanNames() for "methods"', () => {
      const spy = sinon.spy(instance, 'cleanNames');
      const methods = [{ id: 1 }, { id: 2 }];
      instance._cleanItem({
        methods
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][0], methods);
    });

    it('Calls cleanNames() for "properties"', () => {
      const spy = sinon.spy(instance, 'cleanNames');
      const properties = [{ id: 1 }, { id: 2 }];
      instance._cleanItem({
        properties
      });
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[1][0], properties);
    });

    it('Deletes sourceRange', () => {
      const result = instance._cleanItem({
        sourceRange: {}
      });
      assert.isUndefined(result.sourceRange);
    });

    it('Deletes attributes', () => {
      const result = instance._cleanItem({
        attributes: {}
      });
      assert.isUndefined(result.attributes);
    });

    it('Deletes staticMethods', () => {
      const result = instance._cleanItem({
        staticMethods: {}
      });
      assert.isUndefined(result.staticMethods);
    });
  });

  describe('cleanArray()', () => {
    let instance;

    beforeEach(() => {
      const wd = path.join(__dirname, 'test-component-esm');
      const cmp = 'test-component';
      const tv = '1.0.0';
      const org = 'advanced-rest-client';
      instance = new CatalogDataGenerator(wd, org, cmp, tv);
    });

    it('Returns undefined for no argument', () => {
      const result = instance.cleanArray();
      assert.isUndefined(result);
    });

    it('Returns empty array for empty argument', () => {
      const arg = [];
      const result = instance.cleanArray(arg);
      assert.deepEqual(result, arg);
    });

    it('Deletes sourceRange', () => {
      const arg = [
        {
          sourceRange: {}
        }
      ];
      const result = instance.cleanArray(arg);
      assert.deepEqual(result, [{}]);
    });
  });

  describe('cleanNames()', () => {
    let instance;

    beforeEach(() => {
      const wd = path.join(__dirname, 'test-component-esm');
      const cmp = 'test-component';
      const tv = '1.0.0';
      const org = 'advanced-rest-client';
      instance = new CatalogDataGenerator(wd, org, cmp, tv);
    });

    it('Returns undefined for no argument', () => {
      const result = instance.cleanNames();
      assert.isUndefined(result);
    });

    it('Returns empty array for empty argument', () => {
      const arg = [];
      const result = instance.cleanNames(arg);
      assert.deepEqual(result, arg);
    });

    it('Filters out Polymer inheritance', () => {
      const arg = [
        {
          inheritedFrom: 'Polymer'
        },
        {
          test: true
        }
      ];
      const result = instance.cleanNames(arg);
      assert.deepEqual(result, [
        {
          test: true
        }
      ]);
    });
  });
});
