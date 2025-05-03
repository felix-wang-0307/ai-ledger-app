export interface ILLMConfig {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_length?: number;
  min_length?: number;
  stop?: string[];
  presence_penalty?: number;
  frequency_penalty?: number;
};