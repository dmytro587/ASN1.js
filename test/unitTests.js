import * as assert from "assert";
import * as asn1js from "../src/asn1";

//**************************************************************************************
context("Unit tests", () =>
{
	it("LocalBaseBlock", () =>
	{
		const baseBlock = new asn1js.BaseBlock({
			blockLength: 10,
			error: "error",
			warnings: ["warning 1", "warning 2"],
			valueBeforeDecode: (new Uint8Array([0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01]).buffer),
			name: "name",
			optional: true,
			primitiveSchema: new asn1js.OctetString(),
			idBlock: {
				isHexOnly: false,
				valueHex: (new Uint8Array([0x01])).buffer,
				tagClass: 1,
				tagNumber: 1,
				isConstructed: false
			},
			lenBlock: {
				isIndefiniteForm: false,
				longFormUsed: false,
				length: 10
			}
		});

		assert.equal(baseBlock.blockLength, 10, "Incorrect value for blockLength");
		assert.equal(baseBlock.error, "error", "Incorrect value for error");
		assert.equal(baseBlock.warnings.length, 2, "Incorrect value for warnings");
		assert.equal(baseBlock.valueBeforeDecode.byteLength, 10, "Incorrect value for valueBeforeDecode");
		assert.equal(baseBlock.constructor.blockName(), "BaseBlock", "Incorrect value for blockName");

		const parseFunction = (key, value) =>
		{
			switch(key)
			{
				case "valueHex":
				case "valueBeforeDecode":
					const matches = value.match(/[\da-f]{2}/gi);
					if(matches === null)
						return new ArrayBuffer(0);

					return (new Uint8Array(matches.map(hex => parseInt(hex, 16)))).buffer;
				default:
					return value;
			}
		};

		const string = JSON.stringify(baseBlock);
		const object = JSON.parse(string, parseFunction);

		const secondaryBaseBlock = new asn1js.BaseBlock(object);

		const octetString = new asn1js.OctetString({ valueHex: (new Uint8Array([0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01])).buffer });

		const secondaryOctetString = new asn1js.OctetString(JSON.parse(JSON.stringify(octetString), parseFunction))
	});

	it("toString", () =>
	{
		const certB64 = "MIIDLjCCAhagAwIBAgIBATANBgkqhkiG9w0BAQsFADA6MRkwFwYDVQQDExBUZXN0IGNlcnRpZmljYXRlMR0wGwYJKoZIhvcNAQkBFg5zb21lQGVtYWlsLm5ldDAeFw0yMTAzMTYwMDAwMDBaFw0yMTA0MTYwMDAwMDBaMDoxGTAXBgNVBAMTEFRlc3QgY2VydGlmaWNhdGUxHTAbBgkqhkiG9w0BCQEWDnNvbWVAZW1haWwubmV0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3N6J0GUJ8URj2fduC26mjCzWf75jM3QSLQYiXSTAMqJA9apf09GMmT+UC6jq2J1U49mXGezE64uXv2tyys9S07xgRkNAWPJXz0opKYud4XPEpdxKfQkD2XklK+8R3BPhAOOxSpfR+SFkLxTMiDHsOt+Xbb98DZ8F3QkzHLvX42jEfAR0StIRLgFYEtf4vX9q4OsYTeJ4xk61lTJc3d0ep/JTp55fxWRaQdzhg+fkv9XwJxxhW9pJRekZORnRb4Q1Zyw+uecuIffsmhLzang45npfzAKXuPaE6lnRMHauLQ1rGGqYA/Vaq4UU6yZUTVLpsKON7b1xogMQrqIkbqtTuQIDAQABoz8wPTAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB/wQEAwIEkDAdBgNVHQ4EFgQUl4hohjz9Xxb4lYhsOiq9wVqKv8YwDQYJKoZIhvcNAQELBQADggEBAIKH86qkFJV3FZyblAMWDSEbEi4MV2Epb5ty7wpSatHvz8NKtmB/hVFGwWFBj5OfS9wfaX6Uw24DyBSBOOqEzonUeqFTDo54zqQ4fQ+UlC/79aq7awGpEuXFnUF3xiLFqHNz5zUeKEYY0W5XKFg/TiW6hAmxlDg5ybAoHDROpwT4u6TuOK6OxMneQRBESmZlO43DYwCG950fXEDJT2gXVLbbSSTln8JBHfTAwOgmsDtaZOCieTS6KYwscWy3u/8xxMyX8NS3A1Zeh0jtk/irKzfsNAdcl8aQwdckGAkPWT/9EqawC33Ep3+2br41+K1jjGT8LeYDlMYSJycWo9tltKc=";
		const { result } = asn1js.fromBER(new Uint8Array(Buffer.from(certB64, "base64")).buffer);
		const asnString = result.toString();
		// console.log(asnString);
		assert.strictEqual(asnString.length > 0, true);
	});


});
//**************************************************************************************
