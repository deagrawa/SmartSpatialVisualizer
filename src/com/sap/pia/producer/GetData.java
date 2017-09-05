package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.SQLTimeoutException;
import java.sql.Statement;
import java.util.List;
import java.util.Map;
import javax.naming.NamingException;
import org.odata4j.core.OEntity;
import org.odata4j.core.OEntityKey;
import org.odata4j.edm.EdmDataServices;
import org.odata4j.edm.EdmEntitySet;
import org.odata4j.producer.EntitiesResponse;
import org.odata4j.producer.EntityResponse;
import org.odata4j.producer.QueryInfo;
import org.odata4j.producer.Responses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GetData
{

	private String dataBase;
	private EdmDataServices metaDataObj;
	/** jdbc connection */
	private Connection connection;
	/** jdbc operation assistant */
	private JdbcOperator jdbc;
	GetMetaData getMetaData;
	OdataDataDao appDataDao;

	/**
	 * Member variables which will be read from properties files
	 */
	private Map<String, String> propertiesMap;

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(GetData.class);

	GetData(EdmDataServices metadata)
	{
		try
		{
			propertiesMap= OdataUtility.getPropertiesMap();
			dataBase= propertiesMap.get("dataBase");
			jdbc= new JdbcOperator();
			metaDataObj= metadata;
			appDataDao= new OdataDataDao();
		}
		catch(NamingException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
	}

	/**
	 * getAllData method used to select all data for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param queryInfo
	 *            Condition clause
	 * @return
	 *			  Return response in entity of properties.
	 */
	public EntitiesResponse getAllData(String entitySetName, QueryInfo queryInfo)
	{
		EdmEntitySet ees= null;
		List<OEntity> entities= null;
		ResultSet res= null;
		Statement st= null;
		try
		{

			
			connection= appDataDao.getConnection();
			ees= metaDataObj.getEdmEntitySet(entitySetName);
			
			String sql= "select * from " + "\""+ dataBase + "\""+ ".\"" + entitySetName + "\"";

			if(queryInfo.filter != null)
			{
				String tail= jdbc.generateFilter(queryInfo.filter);
				if(tail.length() > 0)
				{
					sql+= " WHERE" + tail;
				}
			}
			if(queryInfo.orderBy != null && queryInfo.orderBy.size() > 0)
			{
				String tail= jdbc.generateOrderby(queryInfo.orderBy);
				if(tail.length() > 0)
				{
					sql+= " ORDER BY" + tail;
				}
			}
			if(queryInfo.top != null)
			{
				int topValue= queryInfo.top;
				if(topValue > 0)
				{
					sql+= " limit " + topValue;
				}
			}

			if(queryInfo.skip != null)
			{
				int offset= queryInfo.skip;
				if(offset >= 0)
				{
					sql+= " OFFSET " + offset;
				}
			}

			LOGGER.info("Query SQL: " + sql);

			st= connection.createStatement();
			res= st.executeQuery(sql);
			entities= jdbc.resultToEntities(res, ees);
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally
		{
			OdataUtility.safeClose(res);
			OdataUtility.safeClose(st);
			OdataUtility.safeClose(connection);
		}
		return Responses.entities(entities, ees, null, null);
	}

	/**
	 * getRowCount method used to get row count for a given table with condition clause.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param queryInfo
	 *            Condition clause
	 * @return
	 *			  Return total number of rows.
	 */
	public long getRowCount(String entitySetName, QueryInfo queryInfo)
	{
		ResultSet res= null;
		Statement st= null;
		long count= 0;
		try
		{
			connection= appDataDao.getConnection();
			String sql= "select COUNT(*) COUNT from " + dataBase + "." + entitySetName;

			if(queryInfo.filter != null)
			{
				String tail= jdbc.generateFilter(queryInfo.filter);
				if(tail.length() > 0)
				{
					sql+= " WHERE" + tail;
				}
			}
			if(queryInfo.orderBy != null && queryInfo.orderBy.size() > 0)
			{
				String tail= jdbc.generateOrderby(queryInfo.orderBy);
				if(tail.length() > 0)
				{
					sql+= " ORDER BY" + tail;
				}
			}
			if(queryInfo.top != null)
			{
				int topValue= queryInfo.top;
				if(topValue > 0)
				{
					sql+= " limit " + topValue;
				}
			}

			LOGGER.info("Query SQL: " + sql);

			st= connection.createStatement();
			res= st.executeQuery(sql);
			while(res.next())
			{
				count= res.getLong("COUNT");
			}
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally
		{
			OdataUtility.safeClose(res);
			OdataUtility.safeClose(st);
			OdataUtility.safeClose(connection);
		}
		return count;
	}

	/**
	 * getEntity method used to get data for a given data with primary key constraint.
	 * 
	 * @param entitySetName
	 *            Table name
	 * @param queryInfo
	 *            Condition clause
	 * @return
	 *			  Return response in entity of property.
	 */
	public EntityResponse getEntity(String entitySetName, OEntityKey entityKey)
	{
		EdmEntitySet ees= metaDataObj.getEdmEntitySet(entitySetName);
		String keyField= ees.getType().getKeys().get(0);
		String keyValue= entityKey.asSingleValue().toString();
		String sql= "select * from " + dataBase + "." + entitySetName + " WHERE " + keyField + "=" + "'" + keyValue + "'";
		LOGGER.info("Query SQL: " + sql);
		List<OEntity> entities= null;
		Statement st= null;
		ResultSet res= null;
		try
		{
			connection= appDataDao.getConnection();
			st= connection.createStatement();
			res= st.executeQuery(sql);
			entities= jdbc.resultToEntities(res, ees);
			res.close();
			st.close();
		}
		catch(SQLTimeoutException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally
		{
			OdataUtility.safeClose(res);
			OdataUtility.safeClose(st);
			OdataUtility.safeClose(connection);
		}
		return Responses.entity(entities.get(0));
	}

}
