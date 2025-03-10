# Installation

## Package manager

`$ npm install upload-jet`

Once the package is installed, you can import the library by using import or
require approach:

```javascript
import UploadJet from 'upload-jet';

// or

const UploadJet = require('upload-jet');
```

## Usage

To use the uploader it is required to provide an api key when creating
a new instance of Upload Jet class.

```javascript
const uploadJet = new UploadJet({ apiKey: API_KEY });
```

### Registering a new route

The following example demonstrates registering a new route:

```javascript
app.use('/api/upload', uploadJet.createUploadRoute());
```

This example will generate a simple policy with no restrictions on upload files.
You can create restrictions by passing the config object to the createUploadRoute method.
Below you can see an example of an upload route with multiple restrictions.

```javascript
const createUploadRoute = new UploadJet({ apiKey });

const route = createUploadRoute({
  fileType: 'image',
  maxFileSize: '1000MB',
  maxFileCount: 6,
  public: true,
  setFileName: (req, fileName) => {
    return fileName;
  }
});

router.post('/profile/images', route);
```

The created policy will have the following properties:

- File type must be an image
- Maximum file size is 1000MB
- Maximum number of files that can be uploaded is 6
- Uploaded files will be visible to the public

Users can also specify their own method for generating file names as shown above.
If no method is specified file name will be derived from the original file name
and random seed.
