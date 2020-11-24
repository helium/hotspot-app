import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, SectionList, Switch } from 'react-native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { useAppDispatch } from '../../../store/store'
import userSlice from '../../../store/user/userSlice'
import version from '../../../utils/version'

type ActionType = 'press' | 'toggle' | 'select'
type SectionRow = {
  title: string
  destructive?: boolean
  action?: (value?: boolean) => void
  actionType?: ActionType
  value?: boolean
}
type Section = { title: string; data: SectionRow[] }

const MoreScreen = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleSignOut = useCallback(() => {
    Alert.alert(
      t('more.sections.account.signOutAlert.title'),
      t('more.sections.account.signOutAlert.body'),
      [
        {
          text: t('generic.cancel'),
          style: 'cancel',
        },
        {
          text: t('generic.ok'),
          style: 'destructive',
          onPress: () => {
            dispatch(userSlice.actions.signOut())
          },
        },
      ],
    )
  }, [t, dispatch])

  const SECTION_DATA: Section[] = [
    {
      title: t('more.sections.security.title'),
      data: [
        { title: t('more.sections.security.enablePin') },
        { title: t('more.sections.security.requirePin') },
        { title: t('more.sections.security.resetPin') },
        {
          title: t('more.sections.security.requirePinForPayments'),
          action: (value) => {
            console.log(value)
          },
          value: true,
          actionType: 'toggle',
        },
      ],
    },
    // { title: t('more.sections.learn.title'), data: [] },
    // { title: t('more.sections.advanced.title'), data: [] },
    {
      title: t('more.sections.account.title'),
      data: [
        {
          title: t('more.sections.account.signOut'),
          action: handleSignOut,
          actionType: 'press',
          destructive: true,
        },
      ],
    },
    {
      title: t('more.sections.app.title'),
      data: [{ title: `v${version}` }],
    },
  ]

  const Item = ({
    item: { title, destructive, action, actionType },
  }: {
    item: SectionRow
  }) => (
    <TouchableOpacityBox
      flexDirection="row"
      justifyContent="space-between"
      backgroundColor="darkGray"
      padding="m"
      onPress={action}
      disabled={actionType !== 'press'}
    >
      <Text variant="body" color={destructive ? 'red' : 'primaryText'}>
        {title}
      </Text>
      {actionType === 'toggle' && (
        <Switch
          // value={value}
          onValueChange={action}
        />
      )}
    </TouchableOpacityBox>
  )

  return (
    <SafeAreaBox backgroundColor="secondaryBackground" flex={1} paddingTop="xl">
      <SectionList
        sections={SECTION_DATA}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => <Item item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            variant="body"
            fontSize={12}
            paddingHorizontal="m"
            paddingVertical="s"
          >
            {title.toUpperCase()}
          </Text>
        )}
      />
    </SafeAreaBox>
  )
}

export default MoreScreen
