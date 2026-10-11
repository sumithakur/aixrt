const fs = require('fs');

// Update schema
let schemaPath = 'src/lib/schemas/invitation.ts';
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

schemaContent = schemaContent.replace(/preferredRoundtable: z\.string\(\)\.min\(1, 'Please select your preferred roundtable focus'\),/, `priority1Roundtable: z.string().min(1, 'Please select your first choice priority'),
  priority2Roundtable: z.string().min(1, 'Please select your second choice priority'),
  priority3Roundtable: z.string().min(1, 'Please select your third choice priority'),`);

fs.writeFileSync(schemaPath, schemaContent);

// Update form
let formPath = 'src/components/forms/InvitationRequestForm.tsx';
let formContent = fs.readFileSync(formPath, 'utf8');

formContent = formContent.replace(/preferredRoundtable: '',/, `priority1Roundtable: '',
    priority2Roundtable: '',
    priority3Roundtable: '',`);
formContent = formContent.replace(/preferredRoundtable: prefilledRoundtable \|\| parsed.preferredRoundtable \|\| '',/, `priority1Roundtable: prefilledRoundtable || parsed.priority1Roundtable || '',
          priority2Roundtable: parsed.priority2Roundtable || '',
          priority3Roundtable: parsed.priority3Roundtable || '',`);
formContent = formContent.replace(/setFormData\(\(prev\) => \(\{\s*\.\.\.prev,\s*preferredRoundtable:\s*prefilledRoundtable\s*\}\)\);/, `setFormData((prev) => ({ ...prev, priority1Roundtable: prefilledRoundtable }));`);

const singleDropdownHTML = `          <div id="field-preferredRoundtable">
            <label htmlFor="preferredRoundtable" className="block text-xs font-semibold text-text-primary">
              Which executive roundtable is most relevant to your strategic remit? *
            </label>
            <select
              id="preferredRoundtable"
              required
              value={formData.preferredRoundtable || ''}
              onChange={(e) => updateField('preferredRoundtable', e.target.value)}
              className={\`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none \${
                errors.preferredRoundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }\`}
            >
              <option value="" disabled>Select a roundtable discussion lane</option>
              {roundtables.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  Table {rt.order}: {rt.shortTitle} — &ldquo;{rt.title}&rdquo;
                </option>
              ))}
              <option value="not-sure">Not sure / Open to curatorial allocation</option>
            </select>
            {errors.preferredRoundtable && (
              <p className="mt-1 text-xs text-brand-rose">{errors.preferredRoundtable}</p>
            )}
          </div>`;

const tripleDropdownHTML = `          <div id="field-priority1Roundtable">
            <label htmlFor="priority1Roundtable" className="block text-xs font-semibold text-text-primary">
              Priority 1 Roundtable *
            </label>
            <select
              id="priority1Roundtable"
              required
              value={formData.priority1Roundtable || ''}
              onChange={(e) => updateField('priority1Roundtable', e.target.value)}
              className={\`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none \${
                errors.priority1Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }\`}
            >
              <option value="" disabled>Select your first choice priority</option>
              {roundtables.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  Table {rt.order}: {rt.shortTitle} — &ldquo;{rt.title}&rdquo;
                </option>
              ))}
              <option value="not-sure">Not sure / Open to curatorial allocation</option>
            </select>
            {errors.priority1Roundtable && (
              <p className="mt-1 text-xs text-brand-rose">{errors.priority1Roundtable}</p>
            )}
          </div>

          <div id="field-priority2Roundtable">
            <label htmlFor="priority2Roundtable" className="block text-xs font-semibold text-text-primary">
              Priority 2 Roundtable *
            </label>
            <select
              id="priority2Roundtable"
              required
              value={formData.priority2Roundtable || ''}
              onChange={(e) => updateField('priority2Roundtable', e.target.value)}
              className={\`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none \${
                errors.priority2Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }\`}
            >
              <option value="" disabled>Select your second choice priority</option>
              {roundtables.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  Table {rt.order}: {rt.shortTitle} — &ldquo;{rt.title}&rdquo;
                </option>
              ))}
              <option value="not-sure">Not sure / Open to curatorial allocation</option>
            </select>
            {errors.priority2Roundtable && (
              <p className="mt-1 text-xs text-brand-rose">{errors.priority2Roundtable}</p>
            )}
          </div>

          <div id="field-priority3Roundtable">
            <label htmlFor="priority3Roundtable" className="block text-xs font-semibold text-text-primary">
              Priority 3 Roundtable *
            </label>
            <select
              id="priority3Roundtable"
              required
              value={formData.priority3Roundtable || ''}
              onChange={(e) => updateField('priority3Roundtable', e.target.value)}
              className={\`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none \${
                errors.priority3Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }\`}
            >
              <option value="" disabled>Select your third choice priority</option>
              {roundtables.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  Table {rt.order}: {rt.shortTitle} — &ldquo;{rt.title}&rdquo;
                </option>
              ))}
              <option value="not-sure">Not sure / Open to curatorial allocation</option>
            </select>
            {errors.priority3Roundtable && (
              <p className="mt-1 text-xs text-brand-rose">{errors.priority3Roundtable}</p>
            )}
          </div>`;

formContent = formContent.replace(singleDropdownHTML, tripleDropdownHTML);

fs.writeFileSync(formPath, formContent);
