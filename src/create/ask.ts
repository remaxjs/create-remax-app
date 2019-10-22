import async from 'async';
import inquirer, { Question, Answers } from 'inquirer';
import evaluate from './eval';

const promptMapping: ObjectValueType = {
  string: 'input',
  boolean: 'confirm'
}

export interface CustomQuestionType extends Question {
  label?: string,
  choices?: string[],
  type: string,
}

export interface CustomQuestionObjectType {
  [key: string]: CustomQuestionType
}

export default function ask (prompts: CustomQuestionObjectType, data: ObjectValueType, done: () => void) {
  async.eachSeries(Object.keys(prompts), (key: any, next: () => void) => {
    promptFunction(data, key, prompts[key], next)
  }, done)
}

function promptFunction(data: ObjectValueType, key: any, prompt: CustomQuestionType, done: () => void) {
  if (prompt.when && !evaluate(prompt.when, data)) {
    return done()
  }

  let promptDefault = prompt.default
  if (typeof prompt.default === 'function') {
    promptDefault = function (this: any) {
      return prompt.default.bind(this)(data)
    }
  }

  inquirer.prompt<Answers>([{
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message || prompt.label || key,
    default: promptDefault,
    choices: prompt.choices || [],
    validate: prompt.validate || (() => true)
  }]).then((answers: Answers) => {
    if (typeof answers[key] === 'string') {
      data[key] = answers[key].replace(/"/g, '\\"')
    } else {
      data[key] = answers[key]
    }
    done()
  }).catch(done)
}
