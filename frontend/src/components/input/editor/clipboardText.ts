import type {Fragment, Node as ProseMirrorNode, Slice} from '@tiptap/pm/model'

// Plain text for the clipboard. Without this, copying a list would drop its structure:
// the default text serializer joins the items without any markers.

function fragmentLines(fragment: Fragment): string[] {
	const lines: string[] = []
	fragment.forEach(node => lines.push(...nodeLines(node)))
	return lines
}

function nodeLines(node: ProseMirrorNode): string[] {
	if (node.isText) {
		return [node.text ?? '']
	}

	if (node.type.name === 'bulletList') {
		const lines: string[] = []
		node.forEach(item => {
			const [first = '', ...rest] = nodeLines(item)
			lines.push(`- ${first}`, ...rest.map(line => `  ${line}`))
		})
		return lines
	}

	if (node.isTextblock) {
		return [node.textContent]
	}

	if (node.isLeaf) {
		return []
	}

	return fragmentLines(node.content)
}

/**
 * Serializes a copied slice as plain text, keeping bullet list markers.
 */
export function sliceToPlainText(slice: Slice): string {
	return fragmentLines(slice.content).join('\n')
}
