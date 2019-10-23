import degit from 'degit';

export default (templateRepo: string, tmpPath: string) => {
  const emitter = degit(templateRepo, {
    cache: false,
    force: true,
    verbose: true,
  });
  return emitter.clone(tmpPath)
}