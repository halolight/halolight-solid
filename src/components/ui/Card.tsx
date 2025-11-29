import { JSX, splitProps, children } from 'solid-js'

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element
}

export function Card(props: CardProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  const classes = () => {
    return `bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 ${local.class || ''}`
  }

  return (
    <div {...others} class={classes()}>
      {local.children}
    </div>
  )
}

export interface CardHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element
}

export function CardHeader(props: CardHeaderProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <div {...others} class={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${local.class || ''}`}>
      {local.children}
    </div>
  )
}

export interface CardTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
  children: JSX.Element
}

export function CardTitle(props: CardTitleProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <h3 {...others} class={`text-lg font-semibold text-gray-900 dark:text-white ${local.class || ''}`}>
      {local.children}
    </h3>
  )
}

export interface CardDescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  children: JSX.Element
}

export function CardDescription(props: CardDescriptionProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <p {...others} class={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${local.class || ''}`}>
      {local.children}
    </p>
  )
}

export interface CardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element
}

export function CardContent(props: CardContentProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <div {...others} class={`px-6 py-4 ${local.class || ''}`}>
      {local.children}
    </div>
  )
}

export interface CardFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element
}

export function CardFooter(props: CardFooterProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <div {...others} class={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${local.class || ''}`}>
      {local.children}
    </div>
  )
}
