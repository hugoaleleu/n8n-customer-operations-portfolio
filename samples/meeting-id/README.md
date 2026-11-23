# Meeting ID generation — limited portfolio sample

Hugo Leleu | Extracted from the AI Meeting & Follow-up Assistant

## What this shows
A small, self-contained n8n workflow: Manual Trigger → example meeting notes → Generate Meeting ID. The JavaScript in the final node is unchanged from Hugo's supplied sanitised workflow. The input, wrapper, documentation and checks were prepared with ChatGPT assistance for this application; they are not a new client project.

The sample converts the exact meeting-notes string into a repeatable, eight-digit reference and retains the input fields. It rejects missing or whitespace-only notes. No AI service, account connection, credential or paid API is needed.

## Run in n8n
1. Import `meeting-id-sample.json` using n8n's import-from-file action.
2. Leave the workflow inactive. Run it manually.
3. Inspect the output of `Generate Meeting ID` for `meeting_id`.
4. Repeat with the same notes, then change the notes and compare the results. Empty notes should raise an error.

## Scope and limits
This shares only one Code node from the larger private workflow, with new demonstration scaffolding. It excludes AI prompts, ownership classification, email handling, recipient routing, spreadsheet integration and recovery branches.

The ID uses a non-cryptographic 32-bit hash reduced to 100 million values. Different text can collide. Identical notes from separate real meetings receive the same reference; even a whitespace change may alter it. This sample alone does not detect duplicates or guarantee unique records. Production identity decisions need additional context and collision handling.

## Verification
Run `node check-sample.cjs`. Checks execute the exported Code-node JavaScript with a minimal stub for n8n's `$input.all()` and verify expected behaviour, including field preservation and multiple inputs. This is not a live n8n import or end-to-end execution test. See `check-results.json` for results.

## Existing project demonstration
[Watch the Meeting Assistant demonstration](https://youtu.be/KZvan5m0iZc). The link was verified accessible without signing in on 23 November 2026. This demonstrates the larger personal project, not this newly extracted sample.

The complete implementation remains private. No open-source licence is granted by this sample.
