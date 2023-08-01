import axios from 'axios';
import * as express from 'express';
import {
  UploadJetConfig,
  uploadJetConfigSchema
} from './schema/upload-jet-config.dto.js';
import {
  UploadOptions,
  uploadOptionsSchema
} from './schema/upload-options.dto.js';
import { v4 as uuidv4 } from 'uuid';
import { createUploadPolicyBodySchema } from './schema/create-upload-policy-body.dto.js';
import * as bytes from 'bytes';
import { ZodError } from 'zod';

const API_URL = 'http://localhost:3000';
const BAD_REQUEST = 400;

export class UploadJet {
  #apiKey: string;

  constructor(config: UploadJetConfig) {
    const data = uploadJetConfigSchema.parse(config);
    this.#apiKey = data.apiKey;
  }

  createUploadRoute(options: UploadOptions) {
    return (req: express.Request, res: express.Response) => {
      return express.json()(req, res, async () => {
        const uploadOptions = await uploadOptionsSchema.parseAsync(options);
        const parsedBody = await createUploadPolicyBodySchema.safeParseAsync(
          req.body
        );

        if (parsedBody.success === false) {
          return res.status(BAD_REQUEST).send({
            message: 'Invalid request body',
            error: mapZodError(parsedBody.error)
          });
        }

        const policies = await this.fetchPolicies(
          parsedBody.data.files,
          uploadOptions,
          req
        );

        return res.json(policies);
      });
    };
  }

  private async fetchPolicies(
    files: string[],
    uploadOptions: UploadOptions,
    req: express.Request
  ) {
    const {
      fileType,
      maxFileSize,
      public: isPublic,
      setFileName
    } = uploadOptions;

    const maxSize = maxFileSize && bytes.parse(maxFileSize);
    const getKey = (originalName: string) =>
      setFileName
        ? setFileName(req, originalName)
        : `${uuidv4()}-${originalName}`;

    const policyRules = files
      .map(originalName => ({
        originalName,
        key: getKey(originalName),
        maxFileSize: maxSize,
        fileType,
        public: isPublic
      }))
      .reduce(
        (acc, { originalName, ...fields }) => ({
          ...acc,
          [originalName]: fields
        }),
        {}
      );

    const url = new URL('upload-policy', API_URL);
    const { data } = await axios.post(url.href, policyRules);
    return data;
  }
}

function mapZodError(error: ZodError) {
  return error.issues.map(({ path, message, code }) => ({
    path,
    message,
    code
  }));
}
