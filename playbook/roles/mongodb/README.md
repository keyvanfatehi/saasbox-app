# enrise.mongodb

This is an Ansible task for installing and configuring MongoDB, as well as creating users and databases.

## Requirements

- Tested on Ansible 1.5
- Tested on Ubuntu 14.04 (trusty), but it should work on any modern Debian based system.

## Dependencies

None.

## Example playbook

To use this role, build a vars file (vars/mongodb.yml, for example) which you include in your playbook,
which contains something like the following:

    mongodb_users:
     - { name: username, password: password, database: dbname }

Next, you can include the role in your playbook:

    - hosts: all
      sudo: yes
      vars_files:
        - vars/mongodb.yml
      roles:
        - enrise.mongodb

## Licence

MIT

## Feedback? Found a bug? Requests?

Let us have it! http://github.com/Enrise/ansible-role-mongodb/issues
