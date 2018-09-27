import { WordsModule } from './words.module';

describe('WordsModule', () => {
  let wordsModule: WordsModule;

  beforeEach(() => {
    wordsModule = new WordsModule();
  });

  it('should create an instance', () => {
    expect(wordsModule).toBeTruthy();
  });
});
