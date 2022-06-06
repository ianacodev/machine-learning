export class NormalizeDataService {
  private readonly DEFAULT_NORMALIZE_SCALE = 10;

  /**
   * normalize data
   * @param data
   * @param scale
   * @returns
   */
  normalizeData<T extends number | number[]>(
    data: T,
    scale = this.DEFAULT_NORMALIZE_SCALE,
  ): T {
    const fixedLength = scale.toString().length;
    const normalizedData = Array.isArray(data)
      ? data.map((dt) => Number((dt / scale).toFixed(fixedLength)))
      : Number(((data as number) / scale).toFixed(fixedLength));
    return normalizedData as T;
  }

  /**
   * denormalize data
   * @param data
   * @param scale
   * @returns
   */
  denormalizeData<T extends number | number[]>(
    data: T,
    scale = this.DEFAULT_NORMALIZE_SCALE,
  ): T {
    const fixedLength = scale.toString().length;
    const denormalizedData = Array.isArray(data)
      ? data.map((dt) => Number((dt * scale).toFixed(fixedLength)))
      : Number(((data as number) * scale).toFixed(fixedLength));
    return denormalizedData as T;
  }
}
